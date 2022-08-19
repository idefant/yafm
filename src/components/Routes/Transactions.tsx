import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { FC, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setIsUnsaved } from '../../store/reducers/appSlice';
import { deleteTransaction } from '../../store/reducers/transactionSlice';
import {
  selectFilteredTransactions,
  selectTransactionCategoryDict,
} from '../../store/selectors';
import { TPeriod } from '../../types/periodType';
import { TTransaction } from '../../types/transactionType';
import Button from '../Generic/Button/Button';
import Select from '../Generic/Form/Select';
import Icon from '../Generic/Icon';
import Table, {
  TColumn,
  TableAction,
  TableOperations,
  TableTooltip,
} from '../Generic/Table';
import { Title } from '../Generic/Title';
import SetTransaction from '../Transaction/SetTransaction';

dayjs.extend(quarterOfYear);

const Transactions: FC = () => {
  const transactions = useAppSelector(selectFilteredTransactions);
  const categoryDict = useAppSelector(selectTransactionCategoryDict);
  const dispatch = useAppDispatch();

  const [isOpenSetter, setIsOpenSetter] = useState(false);
  const [date, setDate] = useState(dayjs());
  const [datePeriodType, setDatePeriodType] = useState<TPeriod>('month');

  const [openedTransaction, setOpenedTransaction] = useState<TTransaction>();
  const [copiedTransaction, setCopiedTransaction] = useState<TTransaction>();

  const openTransaction = (
    transaction?: TTransaction,
  ) => {
    setOpenedTransaction(transaction);
    setCopiedTransaction(undefined);
    setIsOpenSetter(true);
  };

  const copyTransaction = (transaction: TTransaction) => {
    setOpenedTransaction(undefined);
    setCopiedTransaction(transaction);
    setIsOpenSetter(true);
  };

  const transactionGroups = useMemo(() => {
    const transactionGroups = transactions
      .filter((transaction) => {
        const datetime = dayjs(transaction.datetime);
        return (
          datetime > date.startOf(datePeriodType)
          && datetime < date.endOf(datePeriodType)
        );
      })
      .sort((a, b) => b.datetime - a.datetime)
      .reduce((groups: { [date: string]: TTransaction[] }, transaction) => {
        const date = dayjs(transaction.datetime).format('DD.MM.YYYY');
        // eslint-disable-next-line no-param-reassign
        if (!(date in groups)) groups[date] = [];
        groups[date].push(transaction);
        return groups;
      }, {});

    return Object.entries(transactionGroups)
      .map(([name, data]) => ({ name, data, key: name }));
  }, [date, datePeriodType, transactions]);

  const confirmDelete = (transaction: TTransaction) => {
    Swal.fire({
      title: 'Delete transaction',
      icon: 'error',
      text: transaction.name,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteTransaction(transaction.id));
        dispatch(setIsUnsaved(true));
      }
    });
  };

  const tableColumns: TColumn<TTransaction>[] = [
    {
      title: 'Name',
      key: 'name',
    },
    {
      title: 'Date',
      key: 'datetime',
      cellClassName: 'text-center',
      render: ({ record }) => {
        const date = dayjs(record.datetime);
        return (
          <>
            <div>{date.format('DD.MM.YYYY')}</div>
            <div className="text-sm">
              {date.format('HH:mm')}
            </div>
          </>
        );
      },
    },
    {
      title: 'Category',
      key: 'category',
      cellClassName: 'text-center',
      render: ({ record }) => (
        record.category_id && categoryDict[record.category_id].name
      ),
    },
    {
      title: 'Outcome',
      key: 'outcome',
      render: ({ record }) => (
        <TableOperations
          operations={record.operations}
          isPositive={false}
        />
      ),
    },
    {
      title: 'Income',
      key: 'income',
      render: ({ record }) => (
        <TableOperations
          operations={record.operations}
          isPositive
        />
      ),
    },
    {
      title: <Icon.Info className="w-6 h-6 mx-auto" />,
      key: 'description',
      render: ({ record }) => (
        <TableTooltip id={`tr_${record.id}`}>
          {record.description}
        </TableTooltip>
      ),
    },
    {
      key: 'actions',
      cellClassName: '!p-0',
      render: ({ record }) => (
        <div className="flex">
          <TableAction onClick={() => copyTransaction(record)} icon={Icon.Copy} />
          <TableAction onClick={() => openTransaction(record)} icon={Icon.Pencil} />
          <TableAction onClick={() => confirmDelete(record)} icon={Icon.Trash} />
        </div>
      ),
    },
  ];

  const periodOptions = [
    { value: 'month', label: 'Month' },
    { value: 'quarter', label: 'Quarter' },
    { value: 'year', label: 'Year' },
  ];

  return (
    <>
      <Title>Transactions</Title>
      <div className="flex gap-20 items-center my-4">
        <Button color="green" onClick={() => openTransaction()}>
          Create
        </Button>

        <div className="flex gap-3 items-center">
          <Select
            className="border-gray-600"
            options={periodOptions}
            name="categoryId"
            value={periodOptions.find((option) => (option.value === datePeriodType))}
            onChange={(newValue: any) => setDatePeriodType(newValue?.value)}
          />
          <button
            onClick={() => setDate(date.subtract(1, datePeriodType))}
            className="p-2 bg-gray-200 border border-gray-600 rounded-full"
            type="button"
          >
            <Icon.ChevronLeft />
          </button>
          <div>
            {datePeriodType === 'month' && `${date.format('MMM YYYY')}`}
            {datePeriodType === 'quarter'
              && date.format(`Q${date.quarter()} YYYY`)}
            {datePeriodType === 'year' && date.year()}
          </div>
          <button
            onClick={() => setDate(date.add(1, datePeriodType))}
            className="p-2 bg-gray-200 border border-gray-600 rounded-full"
            type="button"
          >
            <Icon.ChevronRight />
          </button>
        </div>
      </div>

      {transactionGroups.length ? (
        <Table
          columns={tableColumns}
          dataGroups={transactionGroups}
          className={{ table: 'w-full' }}
        />
      ) : (
        <div className="font-sans text-3xl">¯\_(ツ)_/¯</div>
      )}

      <SetTransaction
        isOpen={isOpenSetter}
        close={() => setIsOpenSetter(false)}
        transaction={openedTransaction}
        copiedTransaction={copiedTransaction}
      />
    </>
  );
};

export default Transactions;
