import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import React, { FC, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import Swal from 'sweetalert2';

import { formatPrice } from '../../helper/currencies';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setIsUnsaved } from '../../store/reducers/appSlice';
import { deleteTransaction } from '../../store/reducers/transactionSlice';
import {
  selectAccountDict,
  selectCurrencyDict,
  selectFilteredTransactions,
  selectTransactionCategoryDict,
} from '../../store/selectors';
import { TPeriod } from '../../types/periodType';
import { TTransaction, TOperationExtended } from '../../types/transactionType';
import Button from '../Generic/Button/Button';
import Select from '../Generic/Form/Select';
import Icon from '../Generic/Icon';
import Table, {
  TBody, TD, TDIcon, TH, THead, TR,
} from '../Generic/Table';
import { Title } from '../Generic/Title';
import SetTransaction from '../Transaction/SetTransaction';

dayjs.extend(quarterOfYear);

const Transactions: FC = () => {
  const transactions = useAppSelector(selectFilteredTransactions);

  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(dayjs());
  const [datePeriodType, setDatePeriodType] = useState<TPeriod>('month');

  const [openedTransaction, setOpenedTransaction] = useState<TTransaction>();
  const [copiedTransaction, setCopiedTransaction] = useState<TTransaction>();

  const openTransaction = (
    transaction?: TTransaction,
  ) => {
    setOpenedTransaction(transaction);
    setCopiedTransaction(undefined);
    setIsOpen(true);
  };

  const copyTransaction = (transaction: TTransaction) => {
    setOpenedTransaction(undefined);
    setCopiedTransaction(transaction);
    setIsOpen(true);
  };

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
            options={[
              { value: 'month', text: 'Month' },
              { value: 'quarter', text: 'Quarter' },
              { value: 'year', text: 'Year' },
            ]}
            selectedValue={datePeriodType}
            onChange={(e) => setDatePeriodType(e.target.value as TPeriod)}
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

      {transactions.length ? (
        <Table className="w-full">
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Date</TH>
              <TH>Category</TH>
              <TH>Outcome</TH>
              <TH>Income</TH>
              <TH />
              <TH />
              <TH />
              <TH />
            </TR>
          </THead>
          <TBody>
            {Object.entries(transactionGroups).map((group) => (
              <React.Fragment key={group[0]}>
                <TR>
                  <TH colSpan={9} className="!bg-stone-300 !py-0">
                    {group[0]}
                  </TH>
                </TR>
                {group[1].map((transaction) => (
                  <TransactionItem
                    transaction={transaction}
                    openModal={() => openTransaction(transaction)}
                    key={transaction.id}
                    copyTransaction={() => copyTransaction(transaction)}
                  />
                ))}
              </React.Fragment>
            ))}
          </TBody>
        </Table>
      ) : (
        <div className="font-sans text-3xl">¯\_(ツ)_/¯</div>
      )}

      <SetTransaction
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        transaction={openedTransaction}
        copiedTransaction={copiedTransaction}
      />
    </>
  );
};

interface TransactionItemProps {
  transaction: TTransaction;
  openModal: () => void;
  copyTransaction: () => void;
}

const TransactionItem: FC<TransactionItemProps> = ({
  transaction,
  openModal,
  copyTransaction,
}) => {
  const currencyDict = useAppSelector(selectCurrencyDict);
  const accountDict = useAppSelector(selectAccountDict);
  const categoryDict = useAppSelector(selectTransactionCategoryDict);
  const dispatch = useAppDispatch();

  const operations: TOperationExtended[] = transaction.operations.map((operation) => ({
    ...operation,
    account: accountDict[operation.account_id],
    currency: currencyDict[accountDict[operation.account_id].currency_code],
  }));

  const { incomes, outcomes } = operations.reduce((
    acc: { incomes: TOperationExtended[]; outcomes: TOperationExtended[] },
    operation,
  ) => {
    (operation.sum < 0 ? acc.outcomes : acc.incomes).push(operation);
    return acc;
  }, { incomes: [], outcomes: [] });

  const categoryName = transaction.category_id
    ? categoryDict[transaction.category_id].name
    : '-';

  const confirmDelete = () => {
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

  return (
    <TR>
      <TD>{transaction.name}</TD>
      <TD className="text-center">
        <div>{dayjs(transaction.datetime).format('DD.MM.YYYY')}</div>
        <div className="text-sm">
          {dayjs(transaction.datetime).format('HH:mm')}
        </div>
      </TD>
      <TD className="text-center">{categoryName}</TD>

      {outcomes.length ? (
        <TD>
          <div className="text-right grid gap-2">
            {outcomes.map((outcome, index) => (
              <div key={index}>
                <div className="text-red-700">
                  {formatPrice(-outcome.sum, outcome.currency.decimal_places_number)}
                  <span className="pl-2.5">{outcome.currency.code}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {outcome.account.name}
                </div>
              </div>
            ))}
          </div>
        </TD>
      ) : (
        <TD className="text-center">-</TD>
      )}

      {incomes.length ? (
        <TD>
          <div className="text-right grid gap-2">
            {incomes.map((income, index) => (
              <div key={index}>
                <div className="text-green-700">
                  {formatPrice(income.sum, income.currency.decimal_places_number)}
                  <span className="pl-2.5">{income.currency.code || ''}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {income.account.name || ''}
                </div>
              </div>
            ))}
          </div>
        </TD>
      ) : (
        <TD className="text-center">-</TD>
      )}

      <TDIcon>
        {transaction.description && (
          <>
            <div data-tip data-for={`tr_${transaction.id}`} className="px-3">
              <Icon.Info className="w-7 h-7" />
            </div>
            <ReactTooltip
              id={`tr_${transaction.id}`}
              effect="solid"
              className="max-w-sm"
            >
              {transaction.description}
            </ReactTooltip>
          </>
        )}
      </TDIcon>

      <TDIcon>
        <button className="p-2" onClick={copyTransaction} type="button">
          <Icon.Copy className="w-7 h-7" />
        </button>
      </TDIcon>
      <TDIcon>
        <button className="p-2" onClick={openModal} type="button">
          <Icon.Pencil className="w-7 h-7" />
        </button>
      </TDIcon>
      <TDIcon>
        <button className="p-2" onClick={confirmDelete} type="button">
          <Icon.Trash className="w-7 h-7" />
        </button>
      </TDIcon>
    </TR>
  );
};

export default Transactions;
