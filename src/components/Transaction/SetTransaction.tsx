import { ChangeEvent, FC, FormEvent, useMemo, useState } from "react";
import Button from "../Generic/Button/Button";
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
import useForm from "../../hooks/useForm";
import ActionButton from "../Generic/Button/ActionButton";
import { MinusIcon, PlusIcon, RepeatIcon } from "../../assets/svg";

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
      category: { transactions: categories },
    } = store;

    const [form, setForm, updateForm] = useForm({
      name: "",
      description: "",
      outcome_account_id: "",
      outcome_sum: "",
      income_account_id: "",
      income_sum: "",
      category_id: "",
    });

    const accountOptions = accounts.map((account) => ({
      value: account.id,
      text: account.name,
    }));

    const categoryOptions = categories
      .filter((category) => !category.is_archive)
      .map((category) => ({ value: category.id, text: category.name }));

    const outcomeCurrency = useMemo(() => {
      const outcomeAccount = accountDict[form.outcome_account_id];
      return outcomeAccount
        ? currencyDict[outcomeAccount.currency_code]
        : undefined;
    }, [accountDict, currencyDict, form.outcome_account_id]);

    const incomeCurrency = useMemo(() => {
      const incomeAccount = accountDict[form.income_account_id];
      return incomeAccount
        ? currencyDict[incomeAccount.currency_code]
        : undefined;
    }, [accountDict, currencyDict, form.income_account_id]);

    const [transactionType, setTransactionType] =
      useState<TTransactionType>("outcome");
    const [date, setDate] = useState(new Date());

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (
        transactionType !== "outcome" &&
        (!form.income_account_id || +form.income_sum <= 0 || !incomeCurrency)
      )
        return;

      if (
        transactionType !== "income" &&
        (!form.outcome_account_id || +form.outcome_sum <= 0 || !outcomeCurrency)
      )
        return;

      const transactionData = {
        datetime: +date,
        name: form.name,
        description: form.description,
        type: transactionType,
        category_id: form.category_id || undefined,
        income:
          transactionType !== "outcome" && form.income_account_id
            ? {
                account_id: form.income_account_id,
                sum: +(
                  parseFloat(form.income_sum) *
                  10 ** (incomeCurrency?.decimal_places_number || 0)
                ),
              }
            : undefined,
        outcome:
          transactionType !== "income" && form.outcome_account_id
            ? {
                account_id: form.outcome_account_id,
                sum: +(
                  parseFloat(form.outcome_sum) *
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

    const onEnter = () => {
      const outcomeAccountId = transaction?.outcome?.account_id;
      const outcomeAccount = outcomeAccountId
        ? accountDict[outcomeAccountId]
        : undefined;
      const outcomeCurrency =
        outcomeAccount && currencyDict[outcomeAccount.currency_code];

      const incomeAccountId = transaction?.income?.account_id;
      const incomeAccount = incomeAccountId
        ? accountDict[incomeAccountId]
        : undefined;
      const incomeCurrency =
        incomeAccount && currencyDict[incomeAccount.currency_code];

      updateForm({
        name: transaction?.name || "",
        description: transaction?.description || "",
        outcome_account_id: transaction?.outcome?.account_id || "",
        outcome_sum: transaction?.outcome?.sum
          ? getCurrencyValue(transaction.outcome.sum, outcomeCurrency)
          : "",
        income_account_id: transaction?.income?.account_id || "",
        income_sum: transaction?.income?.sum
          ? getCurrencyValue(transaction.income.sum, incomeCurrency)
          : "",
        category_id: transaction?.category_id || "",
      });

      setDate(
        transaction?.datetime ? new Date(transaction.datetime) : new Date()
      );
      setTransactionType(startTransactionType || "outcome");
    };

    return (
      <Modal
        isOpen={isOpen}
        close={close}
        onEnter={onEnter}
        onSubmit={onSubmit}
      >
        <ModalHeader close={close}>
          {transaction ? "Edit Transaction" : "Create Transaction"}
        </ModalHeader>
        <ModalContent>
          <div className="flex justify-center gap-6">
            <ActionButton
              onClick={() => setTransactionType("outcome")}
              color="red"
              active={transactionType === "outcome"}
              shadow={transactionType === "outcome"}
            >
              <MinusIcon className="w-7 h-7" />
            </ActionButton>

            <ActionButton
              onClick={() => setTransactionType("income")}
              color="green"
              active={transactionType === "income"}
              shadow={transactionType === "income"}
            >
              <PlusIcon className="w-7 h-7" />
            </ActionButton>

            <ActionButton
              onClick={() => setTransactionType("exchange")}
              active={transactionType === "exchange"}
              shadow={transactionType === "exchange"}
            >
              <RepeatIcon className="w-7 h-7" />
            </ActionButton>
          </div>

          <FormField
            label="Name"
            name="name"
            value={form.name}
            onChange={setForm}
          />

          <div className="flex items-center my-2 gap-3">
            <label className="block w-1/3">Category</label>
            <Select
              selectedValue={form.category_id}
              name="category_id"
              options={categoryOptions}
              onChange={setForm}
              className="w-2/3"
              useEmpty
              defaultText="Choose a category"
            />
          </div>

          {transactionType !== "income" && (
            <AccountGroupField
              title="Outcome"
              nameSelect="outcome_account_id"
              nameInput="outcome_sum"
              accountId={form.outcome_account_id}
              accountOptions={accountOptions}
              sum={form.outcome_sum}
              currency={outcomeCurrency}
              setSum={setForm}
              onChangeAccount={setForm}
            />
          )}

          {transactionType !== "outcome" && (
            <AccountGroupField
              title="Income"
              nameSelect="income_account_id"
              nameInput="income_sum"
              accountId={form.income_account_id}
              accountOptions={accountOptions}
              sum={form.income_sum}
              currency={incomeCurrency}
              setSum={setForm}
              onChangeAccount={setForm}
            />
          )}

          <Textarea
            value={form.description}
            name="description"
            onChange={setForm}
            placeholder="Description ..."
          />

          <div className="flex gap-2 mt-2 items-center">
            <DatePicker date={date} setDate={setDate} />
            <TimePicker date={date} setDate={setDate} />
            <CalendarButton date={date} setDate={setDate} />
          </div>
        </ModalContent>
        <ModalFooter>
          <Button color="green" type="submit">
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
  setSum: (event: ChangeEvent<HTMLInputElement>) => void;
  currency?: TCurrency;
  title: string;
  onChangeAccount: (e: ChangeEvent<HTMLSelectElement>) => void;
  nameSelect?: string;
  nameInput?: string;
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
    nameSelect,
    nameInput,
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
            name={nameSelect}
            defaultText="Choose"
          />
          <div className="w-2/3 flex gap-4 items-center">
            <input
              type="text"
              name={nameInput}
              className="flex-1 bg-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:bg-gray-100 border focus:border-gray-600"
              value={sum}
              onChange={setSum}
            />
            {currency && <div>{currency.code}</div>}
          </div>
        </div>
      </>
    );
  }
);

export default SetTransaction;
