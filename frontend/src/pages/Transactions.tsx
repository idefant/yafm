import dayjs from 'dayjs';
import { FC, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

import { useFetchRatesByPeriodQuery } from '#api/exratesApi';
import { HeaderInfo } from '#components/Header';
import { SetTransaction } from '#components/Transaction';
import { useAppSelector } from '#hooks/reduxHooks';
import {
  selectAllTransactionsCombined,
  selectCurrencyById,
  selectVisibleAccounts,
  selectVisibleTransactionCategories,
} from '#store/selectors';
import CopyIcon from '#svg/copy.svg?react';
import InfoIcon from '#svg/info.svg?react';
import PencilIcon from '#svg/pencil.svg?react';
import PlusIcon from '#svg/plus.svg?react';
import TrashIcon from '#svg/trash.svg?react';
import { Transaction, TransactionCombined } from '#types/transactionType';
import { Button } from '#ui/Button';
import { Card } from '#ui/Card';
import DateFilter, { useDateFilter } from '#ui/DateFilter';
import { Grid } from '#ui/Grid';
import { useModal } from '#ui/Modal';
import { Select, SelectOption } from '#ui/Select';
import Table, { Column, TableDate, TableOperations, TableTooltip, TableAction } from '#ui/Table';
import { Title } from '#ui/Typography';
import { actionCreator, committer } from '#utils/committer';
import { groupBy } from '#utils/groupBy';
import money from '#utils/money';
import { compareObjByStr } from '#utils/string';

const Transactions: FC = () => {
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

  const transactionModal = useModal();
  const filterData = useDateFilter();
  const { date, periodType } = filterData;

  const { data: prices } = useFetchRatesByPeriodQuery({
    period: filterData.date.format(filterData.periodType === 'year' ? 'YYYY' : 'YYYY-MM'),
  });

  const [openedTransaction, setOpenedTransaction] = useState<Transaction>();
  const [copiedTransaction, setCopiedTransaction] = useState<Transaction>();

  const openTransaction = (transaction?: Transaction) => {
    setOpenedTransaction(transaction);
    setCopiedTransaction(undefined);
    transactionModal.open();
  };

  const copyTransaction = (transaction: Transaction) => {
    setOpenedTransaction(undefined);
    setCopiedTransaction(transaction);
    transactionModal.open();
  };

  const transactionGroups = useMemo(() => {
    const filteredTransactions = transactions
      .filter((transaction) => {
        const datetime = dayjs(transaction.datetime);
        return datetime > date.startOf(periodType) && datetime < date.endOf(periodType);
      })
      .filter((transaction) => {
        if (selectedCategoryIds.size === 0) return true;
        return transaction.category_id && selectedCategoryIds.has(transaction.category_id);
      })
      .filter((transaction) => {
        if (selectedAccountsIds.size === 0) return true;
        return transaction.operations.some((operation) =>
          selectedAccountsIds.has(operation.account_id),
        );
      })
      .sort((a, b) => b.datetime - a.datetime);

    const transactionGroups = groupBy(filteredTransactions, (transaction) =>
      dayjs(transaction.datetime).format('DD.MM.YYYY'),
    );

    return Object.entries(transactionGroups).map(([date, transactions]) => {
      const groupSum = money
        .sum(
          transactions
            .map((transaction) =>
              transaction.operations.map((operation) => ({ ...operation, transaction })),
            )
            .flat()
            .map((operation) => ({
              value: operation.sum,
              currency: operation.account.currency_code,
              rates: prices?.[dayjs(operation.transaction.datetime).format('YYYY-MM-DD')],
            })),
          baseCurrencyCode,
        )
        .value.decimalPlaces(baseCurrency?.decimal_places_number || 0)
        .toFormat();

      return {
        name: (
          <div className="flex justify-between">
            <div>{date}</div>
            <div>
              {groupSum} {baseCurrencyCode}
            </div>
          </div>
        ),
        data: transactions,
        key: date,
      };
    });
  }, [
    baseCurrency?.decimal_places_number,
    baseCurrencyCode,
    date,
    periodType,
    prices,
    selectedAccountsIds,
    selectedCategoryIds,
    transactions,
  ]);

  const confirmDelete = (transaction: TransactionCombined) => {
    Swal.fire({
      title: 'Delete transaction',
      icon: 'error',
      text: transaction.name,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
    }).then(async (result) => {
      if (result.isConfirmed) {
        committer(actionCreator.deleteTransaction(transaction.id)).sync();
      }
    });
  };

  const tableColumns: Column<TransactionCombined>[] = [
    {
      title: 'Name',
      key: 'name',
    },
    {
      title: 'Date',
      key: 'datetime',
      render: ({ record }) => <TableDate date={dayjs(record.datetime)} />,
    },
    {
      title: 'Category',
      key: 'category.name',
      cellClassName: 'text-center',
    },
    {
      title: 'Outcome',
      key: 'outcome',
      render: ({ record }) => <TableOperations operations={record.operations} isPositive={false} />,
    },
    {
      title: 'Income',
      key: 'income',
      render: ({ record }) => <TableOperations operations={record.operations} isPositive />,
    },
    {
      title: <InfoIcon className="w-6 h-6 mx-auto" />,
      key: 'description',
      width: 'min',
      render: ({ record }) => <TableTooltip>{record.description}</TableTooltip>,
    },
    {
      key: 'actions',
      cellClassName: '!p-0',
      width: 'min',
      render: ({ record }) => (
        <div className="flex">
          <TableAction onClick={() => copyTransaction(record)} icon={CopyIcon} />
          <TableAction onClick={() => openTransaction(record)} icon={PencilIcon} />
          <TableAction onClick={() => confirmDelete(record)} icon={TrashIcon} />
        </div>
      ),
    },
  ];

  return (
    <>
      <HeaderInfo
        title="Transactions"
        endAddition={
          <Button
            color="success"
            size="sm"
            startIcon={<PlusIcon />}
            onClick={() => openTransaction()}
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
                columns={tableColumns}
                dataGroups={transactionGroups}
                className={{ table: 'w-full' }}
              />
            </Card.Content>
          </Card>
        </Grid.Item>
      </Grid>

      <SetTransaction
        isOpen={transactionModal.isOpen}
        close={transactionModal.close}
        transaction={openedTransaction}
        copiedTransaction={copiedTransaction}
      />
    </>
  );
};

export default Transactions;
