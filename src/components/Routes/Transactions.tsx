import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import {
  InfoIcon,
  MinusIcon,
  PencilIcon,
  PlusIcon,
  RepeatIcon,
  TrashIcon,
} from "../../assets/svg";
import Table, { TBody, TD, TDIcon, TH, THead, TR } from "../Generic/Table";
import { getCurrencyValue } from "../../helper/currencies";
import store from "../../store";
import SetTransaction from "../Transaction/SetTransaction";
import { TTransaction, TTransactionType } from "../../types/transactionType";
import Swal from "sweetalert2";
import { getDateText, getTimeText } from "../../helper/datetime";
import ReactTooltip from "react-tooltip";
import ActionButton from "../Generic/Button/ActionButton";
import ButtonLink from "../Generic/Button/ButtonLink";

const Transactions: FC = observer(() => {
  const transactions = store.transaction.transactions;
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TTransactionType>();
  const [openedTransaction, setOpenedTransaction] = useState<TTransaction>();

  const openTransaction = (
    type: TTransactionType,
    transaction?: TTransaction
  ) => {
    setOpenedTransaction(transaction);
    setTransactionType(type);
    setIsOpen(true);
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline">Transactions!!!</h1>
      <div className="flex gap-2">
        <ActionButton
          onClick={() => openTransaction("outcome")}
          color="red"
          active
        >
          <MinusIcon className="w-8 h-8" />
        </ActionButton>

        <ActionButton
          onClick={() => openTransaction("income")}
          color="green"
          active
        >
          <PlusIcon className="w-8 h-8" />
        </ActionButton>

        <ActionButton onClick={() => openTransaction("exchange")} active>
          <RepeatIcon className="w-8 h-8" />
        </ActionButton>
      </div>

      <ButtonLink to="categories" color="gray">
        Categories
      </ButtonLink>

      {transactions.length ? (
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Date</TH>
              <TH>Category</TH>
              <TH>Outcome</TH>
              <TH>Income</TH>
              <TH></TH>
              <TH></TH>
              <TH></TH>
            </TR>
          </THead>
          <TBody>
            {transactions.map((transaction) => (
              <TransactionItem
                transaction={transaction}
                openModal={() => openTransaction(transaction.type, transaction)}
                key={transaction.id}
              />
            ))}
          </TBody>
        </Table>
      ) : (
        <div className="font-sans text-3xl">¯\_(ツ)_/¯</div>
      )}

      <SetTransaction
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        startTransactionType={transactionType}
        transaction={openedTransaction}
      />
    </>
  );
});

interface TransactionItemProps {
  transaction: TTransaction;
  openModal: () => void;
}

const TransactionItem: FC<TransactionItemProps> = observer(
  ({ transaction, openModal }) => {
    const {
      currency: { currencyDict },
      account: { accountDict },
      category: { transactionDict: categoryDict },
    } = store;
    const incomeAccount = transaction.income?.account_id
      ? accountDict[transaction.income?.account_id]
      : undefined;
    const outcomeAccount = transaction.outcome?.account_id
      ? accountDict[transaction.outcome?.account_id]
      : undefined;

    const incomeCurrency =
      incomeAccount && currencyDict[incomeAccount.currency_code];
    const outcomeCurrency =
      outcomeAccount && currencyDict[outcomeAccount.currency_code];

    const categoryName = transaction.category_id
      ? categoryDict[transaction.category_id].name
      : "-";

    const confirmDelete = () => {
      Swal.fire({
        title: "Delete transaction",
        icon: "error",
        text: transaction.name,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Delete",
      }).then((result) => {
        if (result.isConfirmed) {
          store.transaction.deleteTransaction(transaction.id);
        }
      });
    };

    return (
      <TR>
        <TD>{transaction.name}</TD>
        <TD className="text-center">
          <div>{getDateText(transaction.datetime)}</div>
          <div className="text-sm">{getTimeText(transaction.datetime)}</div>
        </TD>
        <TD className="text-center">{categoryName}</TD>

        {transaction.outcome && outcomeCurrency && outcomeAccount ? (
          <TD className="text-right">
            <div className="text-red-700">
              {getCurrencyValue(transaction.outcome.sum, outcomeCurrency)}
              <span className="pl-2.5">{outcomeCurrency.code || ""}</span>
            </div>
            <div className="text-sm text-gray-600">
              {outcomeAccount.name || ""}
            </div>
          </TD>
        ) : (
          <TD className="text-center">-</TD>
        )}

        {transaction.income && incomeCurrency && incomeAccount ? (
          <TD className="text-right">
            <div className="text-green-700">
              {getCurrencyValue(transaction.income.sum, incomeCurrency)}
              <span className="pl-2.5">{incomeCurrency.code || ""}</span>
            </div>
            <div className="text-sm text-gray-600">
              {incomeAccount.name || ""}
            </div>
          </TD>
        ) : (
          <TD className="text-center">-</TD>
        )}

        <TDIcon>
          {transaction.description && (
            <>
              <div data-tip data-for={`tr_${transaction.id}`} className="px-3">
                <InfoIcon className="w-7 h-7" />
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
          <button className="p-2" onClick={openModal}>
            <PencilIcon className="w-7 h-7" />
          </button>
        </TDIcon>
        <TDIcon>
          <button className="p-2" onClick={confirmDelete}>
            <TrashIcon className="w-7 h-7" />
          </button>
        </TDIcon>
      </TR>
    );
  }
);

export default Transactions;
