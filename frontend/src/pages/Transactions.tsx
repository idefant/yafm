import {
  createColumnHelper,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import { FC, useCallback, useMemo, useState } from 'react';
import { Except } from 'type-fest';

import { useFetchRatesByPeriodQuery } from '#api/exratesApi';
import { HeaderInfo } from '#components/Header';
import { SetTransaction, SetTransactionModalData } from '#components/Transaction';
import { dayjsTemplate } from '#configs/dayjs';
import { useAppSelector } from '#hooks/reduxHooks';
import {
  selectAllTransactionsExtended,
  selectCurrencyById,
  selectVisibleAccounts,
  selectVisibleCategories,
} from '#store/selectors';
import CopyIcon from '#svg/copy.svg?react';
import PencilIcon from '#svg/pencil.svg?react';
import PlusIcon from '#svg/plus.svg?react';
import TrashIcon from '#svg/trash.svg?react';
import { OperationExtended, TransactionExtended } from '#types/transactionType';
import { Button } from '#ui/Button';
import { Card } from '#ui/Card';
import { DateFilter, useDateFilter } from '#ui/DateFilter';
import { Grid } from '#ui/Grid';
import { dmodal, useModal } from '#ui/Modal';
import { Select, SelectOption } from '#ui/Select';
import { HStack } from '#ui/Stack';
import { SumValue } from '#ui/SumValue';
import { SumValueList } from '#ui/SumValueList';
import { Table } from '#ui/Table';
import { Text, Title } from '#ui/Typography';
import { actionCreator, committer } from '#utils/committer';
import money from '#utils/money';

type TransactionWithBaseSum = Except<TransactionExtended, 'operations'> & {
  baseSum: BigNumber;
  operations: (OperationExtended & { baseSum: BigNumber })[];
};

const columnHelper = createColumnHelper<TransactionWithBaseSum>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    size: Number.MAX_SAFE_INTEGER,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('datetime', {
    header: 'Time',
    size: 0,
    getGroupingValue: (row) => dayjs(row.datetime).format('DD.MM.YYYY'),
    cell: (info) => dayjs(info.getValue()).format('HH:mm'),
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    size: 100,
    cell: (info) => info.getValue()?.name,
  }),
  columnHelper.accessor('operations', {
    header: 'Operations',
    size: 0,
    // eslint-disable-next-line react/no-unstable-nested-components
    cell: (info) => (
      <SumValueList
        items={info.getValue().map(({ sum, account }) => ({
          value: BigNumber(sum),
          decimalPlaces: account.currency.decimalPlaces,
          currencyCode: account.currencyCode,
          description: account.name,
        }))}
      />
    ),
    meta: { justify: 'end' },
  }),
];

const grouping = ['datetime'];

export const Transactions: FC = () => {
  const { mainCurrencyCode } = useAppSelector((state) => state.currencies);
  const mainCurrency = useAppSelector((state) => selectCurrencyById(state, mainCurrencyCode));
  const categories = useAppSelector(selectVisibleCategories);
  const accounts = useAppSelector(selectVisibleAccounts);
  const transactions = useAppSelector(selectAllTransactionsExtended);

  const [selectedCategories, setSelectedCategories] = useState<SelectOption[]>([]);
  const selectedCategoryIds = useMemo(
    () => new Set(selectedCategories.map(({ value }) => value)),
    [selectedCategories],
  );

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const [selectedAccounts, setSelectedAccounts] = useState<SelectOption[]>([]);
  const selectedAccountsIds = useMemo(
    () => new Set(selectedAccounts.map(({ value }) => value)),
    [selectedAccounts],
  );

  const accountOptions = accounts.map((category) => ({ value: category.id, label: category.name }));

  const transactionModal = useModal<SetTransactionModalData>();
  const dateFilter = useDateFilter();

  const { data: prices } = useFetchRatesByPeriodQuery({
    period: dateFilter.period.formatted,
  });

  const transactionsWithBaseSum = useMemo(
    () =>
      transactions.map((transaction) => {
        const operations = transaction.operations.map((operation) => ({
          ...operation,
          baseSum: money(operation.sum, operation.account.currencyCode).to(
            mainCurrencyCode,
            prices?.[dayjs(transaction.datetime).format(dayjsTemplate.date)],
          ).value,
        }));

        return {
          ...transaction,
          operations,
          baseSum: BigNumber.sum(...operations.map((operation) => operation.baseSum)),
        };
      }),
    [mainCurrencyCode, prices, transactions],
  );

  const filteredTransactions = useMemo(
    () =>
      transactionsWithBaseSum
        .filter((transaction) => {
          if (!dateFilter.period.includes(transaction.datetime)) return false;
          if (selectedCategoryIds.size > 0) {
            if (!transaction.categoryId || !selectedCategoryIds.has(transaction.categoryId))
              return false;
          }
          if (selectedAccountsIds.size > 0) {
            if (
              !transaction.operations.some((operation) =>
                selectedAccountsIds.has(operation.accountId),
              )
            )
              return false;
          }
          return true;
        })
        .toReversed(),
    [dateFilter.period, selectedAccountsIds, selectedCategoryIds, transactionsWithBaseSum],
  );

  const table = useReactTable({
    groupedColumnMode: false,
    state: {
      grouping,
      expanded: true,
    },
    data: filteredTransactions,
    columns,
    getRowId: (original) => original.id,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const confirmDelete = useCallback(async (transaction: TransactionExtended) => {
    const modalResult = await dmodal.error({
      title: 'Delete transaction',
      content: `Transaction name: ${transaction.name || '-'}`,
      confirmText: 'Delete',
      confirmColor: 'danger',
    });

    if (modalResult.isConfirmed) {
      committer(actionCreator.deleteTransaction(transaction.id)).sync();
    }
  }, []);

  const renderGroupCell = useCallback(
    (row: Row<TransactionWithBaseSum>) => {
      const sum = BigNumber.sum(...row.subRows.map((subRow) => subRow.original.baseSum));
      return (
        <HStack justify="spaceBetween" grow={1}>
          <Text color="secondary" size="sm" weight="bold">
            {dayjs(row.original.datetime).format('DD.MM.YYYY, dddd')}
          </Text>
          <SumValue
            value={sum}
            currencyCode={mainCurrencyCode}
            decimalPlaces={mainCurrency?.decimalPlaces}
            color="secondary"
            size="sm"
            weight="bold"
          />
        </HStack>
      );
    },
    [mainCurrency?.decimalPlaces, mainCurrencyCode],
  );

  const getRowContextMenu = useCallback(
    (row: Row<TransactionWithBaseSum>) => ({
      label: row.original.name || row.original.category?.name,
      items: [
        {
          key: 'edit',
          label: 'Edit',
          icon: PencilIcon,
          onClick: () => transactionModal.open({ transaction: row.original, method: 'edit' }),
        },
        {
          key: 'copy',
          label: 'Copy',
          icon: CopyIcon,
          onClick: () => transactionModal.open({ transaction: row.original, method: 'copy' }),
        },
        {
          key: 'delete',
          label: 'Delete',
          icon: TrashIcon,
          onClick: () => confirmDelete(row.original),
        },
      ],
    }),
    [confirmDelete, transactionModal],
  );

  return (
    <>
      <HeaderInfo
        title="Transactions"
        endAddition={
          <Button
            color="success"
            size="sm"
            startIcon={<PlusIcon />}
            onClick={() => transactionModal.open({ method: 'create' })}
          >
            Add
          </Button>
        }
        endAdditionGap={24}
      />

      <Grid gap={16} reversed>
        <Grid.Item size={3}>
          <Card>
            <Card.Content>
              <Title level={4} gutterBottom>
                Filter
              </Title>

              <DateFilter options={dateFilter} />

              <Select
                label="Category"
                placeholder="Choose category..."
                options={categoryOptions}
                value={selectedCategories}
                onChange={(newValue: any) => setSelectedCategories(newValue)}
                isMulti
                margin="sm"
              />

              <Select
                label="Account"
                placeholder="Choose account..."
                options={accountOptions}
                value={selectedAccounts}
                onChange={(newValue: any) => setSelectedAccounts(newValue)}
                isMulti
                margin="sm"
              />
            </Card.Content>
          </Card>
        </Grid.Item>

        <Grid.Item size={9}>
          <Card>
            <Card.Content>
              <Title level={4} gutterBottom>
                List of Transactions
              </Title>

              <Table
                table={table}
                fullWidth
                renderGroupCell={renderGroupCell}
                rowContextMenu={getRowContextMenu}
                rowOnClick={(row) =>
                  transactionModal.open({ transaction: row.original, method: 'edit' })
                }
              />
            </Card.Content>
          </Card>
        </Grid.Item>
      </Grid>

      <SetTransaction modal={transactionModal} />
    </>
  );
};
