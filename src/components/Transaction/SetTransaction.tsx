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
import {
  TTemplate,
  TTransaction,
  TTransactionType,
} from "../../types/transactionType";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "../Generic/Form/DatePicker";
import TimePicker from "../Generic/Form/TimePicker";
import { observer } from "mobx-react-lite";
import store from "../../store";
import CalendarButton from "../Generic/Form/CalendarButton";
import { TCurrency } from "../../types/currencyType";
import { displayToSysValue, getCurrencyValue } from "../../helper/currencies";
import useForm from "../../hooks/useForm";
import ActionButton from "../Generic/Button/ActionButton";
import { MinusIcon, PlusIcon, RepeatIcon, StarIcon } from "../../assets/svg";
import ChooseTemplate from "../Template/ChooseTemplate";

interface SetTransactionProps {
  transaction?: TTransaction;
  isOpen: boolean;
  close: () => void;
  startTransactionType?: TTransactionType;
  copiedTransaction?: TTransaction;
}

const SetTransaction: FC<SetTransactionProps> = observer(
  ({ isOpen, close, transaction, startTransactionType, copiedTransaction }) => {
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
    const [isOpenTemplateModal, setIsOpenTemplateModal] = useState(false);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (
        transactionType !== "outcome" &&
        (!form.income_account_id || +form.income_sum < 0 || !incomeCurrency)
      )
        return;

      if (
        transactionType !== "income" &&
        (!form.outcome_account_id || +form.outcome_sum < 0 || !outcomeCurrency)
      )
        return;

      const transactionData = {
        datetime: +date,
        name: form.name || undefined,
        description: form.description || undefined,
        type: transactionType,
        category_id: form.category_id || undefined,
        income:
          transactionType !== "outcome" &&
          form.income_account_id &&
          incomeCurrency
            ? {
                account_id: form.income_account_id,
                sum: displayToSysValue(form.income_sum, incomeCurrency),
              }
            : undefined,
        outcome:
          transactionType !== "income" &&
          form.outcome_account_id &&
          outcomeCurrency
            ? {
                account_id: form.outcome_account_id,
                sum: displayToSysValue(form.outcome_sum, outcomeCurrency),
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

    const getCurrencyByAccountId = (accountId?: string) => {
      const incomeAccount = accountId ? accountDict[accountId] : undefined;
      return incomeAccount && currencyDict[incomeAccount.currency_code];
    };

    const onEnter = () => {
      const trans = transaction || copiedTransaction;
      const outcomeCurrency = getCurrencyByAccountId(
        trans?.outcome?.account_id
      );
      const incomeCurrency = getCurrencyByAccountId(trans?.income?.account_id);

      updateForm({
        name: trans?.name || "",
        description: trans?.description || "",
        outcome_account_id: trans?.outcome?.account_id || "",
        outcome_sum: trans?.outcome?.sum
          ? getCurrencyValue(trans.outcome.sum, outcomeCurrency)
          : "",
        income_account_id: trans?.income?.account_id || "",
        income_sum: trans?.income?.sum
          ? getCurrencyValue(trans.income.sum, incomeCurrency)
          : "",
        category_id: trans?.category_id || "",
      });

      setDate(
        transaction?.datetime ? new Date(transaction.datetime) : new Date()
      );
      setTransactionType(startTransactionType || "outcome");
    };

    const setTransactionUsingTemplate = (
      template: TTemplate,
      transactionType: TTransactionType
    ) => {
      const outcomeCurrency = getCurrencyByAccountId(
        template.outcome?.account_id
      );
      const incomeCurrency = getCurrencyByAccountId(
        template.income?.account_id
      );

      updateForm({
        name: template.name || form.name,
        description: template.description || form.description,
        outcome_account_id:
          template.outcome?.account_id || form.outcome_account_id,
        outcome_sum: template.outcome?.sum
          ? getCurrencyValue(template.outcome.sum, outcomeCurrency)
          : "" || form.outcome_sum,
        income_account_id:
          template.income?.account_id || form.income_account_id,
        income_sum: template.income?.sum
          ? getCurrencyValue(template.income.sum, incomeCurrency)
          : "" || form.income_sum,
        category_id: template.category_id || form.category_id,
      });
      setTransactionType(transactionType);
    };

    return (
      <>
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
            <div className="flex justify-center gap-3">
              <div className="flex justify-center gap-6 border-r-2 border-gray-400 pr-3">
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

              <ActionButton
                onClick={() => setIsOpenTemplateModal(true)}
                color="yellow"
                active
              >
                <StarIcon className="w-7 h-7" />
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
        <ChooseTemplate
          isOpen={isOpenTemplateModal}
          close={() => setIsOpenTemplateModal(false)}
          setTransaction={setTransactionUsingTemplate}
          transactionType={transactionType}
        />
      </>
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
