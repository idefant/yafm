import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import Button from "../Generic/Button";
import FormField from "../Generic/Form/FormField";
import Select from "../Generic/Form/Select";
import Textarea from "../Generic/Form/Textarea";
import Modal, {
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../Generic/Modal";
import { TTransaction, TTransactionType } from "../../types/transactionType";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "../Generic/Form/DatePicker";
import TimePicker from "../Generic/Form/TimePicker";
import { observer } from "mobx-react-lite";
import store from "../../store";
import CalendarButton from "../Generic/Form/CalendarButton";
import { TCurrency } from "../../types/currencyType";
import { getCurrencyValue } from "../../helper/currencies";

interface SetTransactionProps {
  transaction?: TTransaction;
  isOpen: boolean;
  close: () => void;
  startTransactionType?: TTransactionType;
}

const SetTransaction: FC<SetTransactionProps> = observer(
  ({ isOpen, close, transaction, startTransactionType }) => {
    const {
      account: { accounts, accountDict },
      currency: { currencyDict },
    } = store;
    const accountOptions = accounts.map((account) => ({
      value: account.id,
      text: account.name,
    }));

    const [incomeCurrency, setIncomeCurrency] = useState<TCurrency>();
    const [outcomeCurrency, setOutcomeCurrency] = useState<TCurrency>();

    const [transactionType, setTransactionType] =
      useState<TTransactionType>("outcome");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date());

    const [incomeAccountId, setIncomeAccountId] = useState<string>();
    const [incomeSum, setIncomeSum] = useState("");

    const [outcomeAccountId, setOutcomeAccountId] = useState<string>();
    const [outcomeSum, setOutcomeSum] = useState("");

    useEffect(() => {
      if (isOpen) {
        setName(transaction?.name || "");
        setDescription(transaction?.description || "");

        const outcomeAccountId = transaction?.outcome?.account_id;
        setOutcomeAccountId(outcomeAccountId);
        const outcomeAccount = outcomeAccountId
          ? accountDict[outcomeAccountId]
          : undefined;
        const outcomeCurrency =
          outcomeAccount && currencyDict[outcomeAccount.currency_code];

        setOutcomeCurrency(outcomeCurrency);
        setOutcomeSum(
          transaction?.outcome?.sum
            ? getCurrencyValue(transaction.outcome.sum, outcomeCurrency)
            : ""
        );

        const incomeAccountId = transaction?.income?.account_id;
        setIncomeAccountId(incomeAccountId);
        const incomeAccount = incomeAccountId
          ? accountDict[incomeAccountId]
          : undefined;
        const incomeCurrency =
          incomeAccount && currencyDict[incomeAccount.currency_code];
        setIncomeCurrency(incomeCurrency);
        setIncomeSum(
          transaction?.income?.sum
            ? getCurrencyValue(transaction.income.sum, incomeCurrency)
            : ""
        );

        setDate(
          transaction?.datetime ? new Date(transaction.datetime) : new Date()
        );
        setTransactionType(
          transaction?.type || startTransactionType || "outcome"
        );
      }
    }, [isOpen, transaction, accountDict, currencyDict, startTransactionType]);

    const onSubmit = (e?: FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      if (
        transactionType !== "outcome" &&
        (!incomeAccountId || +incomeSum <= 0 || !incomeCurrency)
      )
        return;

      if (
        transactionType !== "income" &&
        (!outcomeAccountId || +outcomeSum <= 0 || !outcomeCurrency)
      )
        return;

      const transactionData = {
        datetime: +date,
        name,
        description,
        type: transactionType,
        income:
          transactionType !== "outcome" && incomeAccountId
            ? {
                account_id: incomeAccountId,
                sum: +(
                  parseFloat(incomeSum) *
                  10 ** (incomeCurrency?.decimal_places_number || 0)
                ),
              }
            : undefined,
        outcome:
          transactionType !== "income" && outcomeAccountId
            ? {
                account_id: outcomeAccountId,
                sum: +(
                  parseFloat(outcomeSum) *
                  10 ** (outcomeCurrency?.decimal_places_number || 0)
                ),
              }
            : undefined,
      };

      if (transaction) {
        store.transaction.editTransaction({
          ...transaction,
          ...transactionData,
        });
      } else {
        store.transaction.createTransaction(transactionData);
      }
      close();
    };

    const onChangeAccount = (
      e: ChangeEvent<HTMLSelectElement>,
      setAccountId: (data: string) => void,
      setCurrency: (data?: TCurrency) => void
    ) => {
      setAccountId(e.target.value);
      const accountId = e.target.value;
      const account = accountId ? accountDict[accountId] : undefined;
      setCurrency(account && currencyDict[account.currency_code]);
    };

    return (
      <Modal isOpen={isOpen} close={close}>
        <ModalHeader close={close}>
          {transaction ? "Edit Transaction" : "Create Transaction"}
        </ModalHeader>
        <ModalContent>
          <form onSubmit={onSubmit}>
            <div className="flex justify-evenly">
              <Button color="red" onClick={() => setTransactionType("outcome")}>
                Outcome
              </Button>
              <Button
                color="green"
                onClick={() => setTransactionType("income")}
              >
                Income
              </Button>
              <Button
                color="gray"
                onClick={() => setTransactionType("exchange")}
              >
                Exchange
              </Button>
            </div>

            <FormField
              label="Name"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />

            {transactionType !== "income" && (
              <AccountGroupField
                title="Outcome"
                accountId={outcomeAccountId}
                accountOptions={accountOptions}
                sum={outcomeSum}
                currency={outcomeCurrency}
                setSum={setOutcomeSum}
                onChangeAccount={(e: ChangeEvent<HTMLSelectElement>) =>
                  onChangeAccount(e, setOutcomeAccountId, setOutcomeCurrency)
                }
              />
            )}

            {transactionType !== "outcome" && (
              <AccountGroupField
                title="Income"
                accountId={incomeAccountId}
                accountOptions={accountOptions}
                sum={incomeSum}
                currency={incomeCurrency}
                setSum={setIncomeSum}
                onChangeAccount={(e: ChangeEvent<HTMLSelectElement>) =>
                  onChangeAccount(e, setIncomeAccountId, setIncomeCurrency)
                }
              />
            )}

            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description ..."
            />

            <div className="flex gap-2 mt-2 items-center">
              <DatePicker date={date} setDate={(date: Date) => setDate(date)} />
              <TimePicker date={date} setDate={(date: Date) => setDate(date)} />
              <CalendarButton date={date} setDate={setDate} />
            </div>

            <button type="submit" className="hidden"></button>
          </form>
        </ModalContent>
        <ModalFooter>
          <Button color="green" type="submit" onClick={() => onSubmit()}>
            Save
          </Button>
          <Button color="gray" onClick={close}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
);

interface AccountGroupFieldProps {
  accountId?: string;
  accountOptions: {
    value: string;
    text: string;
  }[];
  sum: string;
  setSum: (data: string) => void;
  currency?: TCurrency;
  title: string;
  onChangeAccount: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const AccountGroupField: FC<AccountGroupFieldProps> = observer(
  ({
    accountId,
    accountOptions,
    sum,
    setSum,
    currency,
    title,
    onChangeAccount,
  }) => {
    return (
      <>
        <div className="text-xl pl-2 font-bold">{title}</div>
        <div className="flex items-center my-2 gap-3">
          <Select
            selectedValue={accountId}
            options={accountOptions}
            onChange={onChangeAccount}
            className="w-1/3"
          />
          <div className="w-2/3 flex gap-4 items-center">
            <input
              type="text"
              className="flex-1 bg-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:bg-gray-100 border focus:border-gray-600"
              value={sum}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSum(e.target.value)
              }
            />
            {currency && <div>{currency.code}</div>}
          </div>
        </div>
      </>
    );
  }
);

export default SetTransaction;
