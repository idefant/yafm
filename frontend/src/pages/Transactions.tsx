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
import { useAppSelector } from '#hooks/reduxHooks';
import {
  selectAllTransactionsCombined,
  selectCurrencyById,
  selectVisibleAccounts,
  selectVisibleTransactionCategories,
} from '#store/selectors';
import CopyIcon from '#svg/copy.svg?react';
import PencilIcon from '#svg/pencil.svg?react';
import PlusIcon from '#svg/plus.svg?react';
import TrashIcon from '#svg/trash.svg?react';
import { OperationCombined, TransactionCombined } from '#types/transactionType';
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
import { compareObjByStr } from '#utils/string';

type TransactionWithBaseSum = Except<TransactionCombined, 'operations'> & {
  baseSum: BigNumber;
  operations: (OperationCombined & { baseSum: BigNumber })[];
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
          decimalPlacesNumber: account.currency.decimal_places_number,
          currencyCode: account.currency_code,
          description: account.name,
        }))}
      />
    ),
    meta: { justify: 'end' },
  }),
];

const grouping = ['datetime'];

export const Transactions: FC = () => {
  const { baseCurrencyCode } = useAppSelector((state) => state.currencies);
  const baseCurrency = useAppSelector((state) => selectCurrencyById(state, baseCurrencyCode));
  const categories = useAppSelector(selectVisibleTransactionCategories);
  const accounts = useAppSelector(selectVisibleAccounts);
  const transactions = useAppSelector(selectAllTransactionsCombined);

  const [selectedCategories, setSelectedCategories] = useState<SelectOption[]>([]);
  const selectedCategoryIds = useMemo(
    () => new Set(selectedCategories.map(({ value }) => value)),
    [selectedCategories],
  );

  const categoryOptions = categories
    .sort((a, b) => compareObjByStr(a, b, (e) => e.name))
    .map((category) => ({ value: category.id, label: category.name }));

  const [selectedAccounts, setSelectedAccounts] = useState<SelectOption[]>([]);
  const selectedAccountsIds = useMemo(
    () => new Set(selectedAccounts.map(({ value }) => value)),
    [selectedAccounts],
  );

  const accountOptions = accounts
    .sort((a, b) => compareObjByStr(a, b, (e) => e.name))
    .map((category) => ({ value: category.id, label: category.name }));

  const transactionModal = useModal<SetTransactionModalData>();
  const filterData = useDateFilter();
  const { date, periodType } = filterData;

  const { data: prices } = useFetchRatesByPeriodQuery({
    period: filterData.date.format(filterData.periodType === 'year' ? 'YYYY' : 'YYYY-MM'),
  });

  const transactionsWithBaseSum = useMemo(
    () =>
      transactions.map((transaction) => {
        const operations = transaction.operations.map((operation) => ({
          ...operation,
          baseSum: money(operation.sum, operation.account.currency_code).to(
            baseCurrencyCode,
            prices?.[dayjs(transaction.datetime).format('YYYY-MM-DD')],
          ).value,
        }));

        return {
          ...transaction,
          operations,
          baseSum: BigNumber.sum(...operations.map((operation) => operation.baseSum)),
        };
      }),
    [baseCurrencyCode, prices, transactions],
  );

  const filteredTransactions = useMemo(
    () =>
      transactionsWithBaseSum
        .sort((a, b) => a.datetime - b.datetime)
        .toReversed()
        .filter((transaction) => {
          const datetime = dayjs(transaction.datetime);
          if (datetime.isBefore(date, periodType) || datetime.isAfter(date, periodType))
            return false;
          if (selectedCategoryIds.size > 0) {
            if (!transaction.category_id || !selectedCategoryIds.has(transaction.category_id))
              return false;
          }
          if (selectedAccountsIds.size > 0) {
            if (
              !transaction.operations.some((operation) =>
                selectedAccountsIds.has(operation.account_id),
              )
            )
              return false;
          }
          return true;
        }),
    [date, periodType, selectedAccountsIds, selectedCategoryIds, transactionsWithBaseSum],
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

  const confirmDelete = useCallback(async (transaction: TransactionCombined) => {
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
            currencyCode={baseCurrencyCode}
            decimalPlacesNumber={baseCurrency?.decimal_places_number || 2}
            color="secondary"
            size="sm"
            weight="bold"
          />
        </HStack>
      );
    },
    [baseCurrency?.decimal_places_number, baseCurrencyCode],
  );

  const getRowContextMenu = useCallback(
    (row: Row<TransactionWithBaseSum>) => ({
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

              <DateFilter options={filterData} />

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
