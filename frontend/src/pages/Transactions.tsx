import dayjs from 'dayjs';
import { FC, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

import { useFetchRatesByPeriodQuery } from '#api/exratesApi';
import { HeaderInfo } from '#components/Header';
import { SetTransaction } from '#components/Transaction';
import { useAppSelector } from '#hooks/reduxHooks';
import useModal from '#hooks/useModal';
import {
  selectAllTransactionsCombined,
  selectCurrencyById,
  selectVisibleAccounts,
  selectVisibleTransactionCategories,
} from '#store/selectors';
import { Transaction, TransactionCombined } from '#types/transactionType';
import { Button } from '#ui/Button';
import Card from '#ui/Card';
import DateFilter, { useDateFilter } from '#ui/DateFilter';
import Icon from '#ui/Icon';
import Select, { SelectOption } from '#ui/Select';
import Table, { Column, TableDate, TableOperations, TableTooltip, TableAction } from '#ui/Table';
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
      title: <Icon.Info className="w-6 h-6 mx-auto" />,
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
          <TableAction onClick={() => copyTransaction(record)} icon={Icon.Copy} />
          <TableAction onClick={() => openTransaction(record)} icon={Icon.Pencil} />
          <TableAction onClick={() => confirmDelete(record)} icon={Icon.Trash} />
        </div>
      ),
    },
  ];

  return (
    <>
      <HeaderInfo title="Transactions" />

      <Card>
        <Card.Header>Transaction Filter</Card.Header>
        <Card.Body>
          <DateFilter options={filterData} />

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="w-full">
              <label>Category:</label>
              <Select
                className="border-gray-600 w-full"
                options={categoryOptions}
                value={selectedCategories}
                onChange={(newValue: any) => setSelectedCategories(newValue)}
                isMulti
              />
            </div>

            <div className="w-full">
              <label>Account:</label>
              <Select
                className="border-gray-600 w-full"
                options={accountOptions}
                value={selectedAccounts}
                onChange={(newValue: any) => setSelectedAccounts(newValue)}
                isMulti
              />
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>List of Transactions</Card.Header>

        <Card.Body>
          <Button onClick={() => openTransaction()}>Create Transaction</Button>

          <Table
            columns={tableColumns}
            dataGroups={transactionGroups}
            className={{ table: 'w-full' }}
          />
        </Card.Body>
      </Card>

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
