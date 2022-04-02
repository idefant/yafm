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
import { TTransaction, TTransactionType } from "../types/transaction";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "../Generic/Form/DatePicker";
import TimePicker from "../Generic/Form/TimePicker";
import { observer } from "mobx-react-lite";
import store from "../store";
import CalendarButton from "../Generic/Form/CalendarButton";

interface SetTransactionProps {
  transaction?: TTransaction;
  isOpen: boolean;
  close: () => void;
}

const SetTransaction: FC<SetTransactionProps> = observer(
  ({ isOpen, close, transaction }) => {
    const accounts = store.account.accounts;
    const accountOptions = accounts.map((account) => ({
      value: account.id,
      text: account.name,
    }));

    const [transactionType, setTransactionType] =
      useState<TTransactionType>("outcome");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date());

    const [incomeAccountId, setIncomeAccountId] = useState<string>();
    const [income, setIncome] = useState("");

    const [outcomeAccountId, setOutcomeAccountId] = useState<string>();
    const [outcome, setOutcome] = useState("");

    useEffect(() => {
      if (isOpen) {
        setName(transaction?.name || "");
        setDescription(transaction?.description || "");
        setIncomeAccountId(transaction?.income_account_id);
        setIncome(transaction?.income_sum?.toString() || "");
        setOutcomeAccountId(transaction?.outcome_account_id);
        setOutcome(transaction?.outcome_sum?.toString() || "");
        setDate(
          transaction?.datetime ? new Date(transaction.datetime) : new Date()
        );
        setTransactionType(transaction?.type || "outcome");
      }
    }, [isOpen, transaction]);

    const onSubmit = (e?: FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      if (transactionType !== "outcome" && !incomeAccountId && +income <= 0)
        return;
      if (transactionType !== "income" && !outcomeAccountId && +outcome <= 0)
        return;

      const transactionData = {
        datetime: +date,
        name,
        description,
        type: transactionType,
        income_account_id:
          transactionType !== "outcome" ? incomeAccountId : undefined,
        income_sum: transactionType !== "outcome" ? +income : undefined,
        outcome_account_id:
          transactionType !== "income" ? outcomeAccountId : undefined,
        outcome_sum: transactionType !== "income" ? +outcome : undefined,
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
              <>
                <div className="text-xl pl-2 font-bold">Outcome</div>
                <div className="flex items-center my-2 gap-3">
                  <Select
                    selectedValue={outcomeAccountId}
                    options={accountOptions}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setOutcomeAccountId(e.target.value)
                    }
                    className="w-1/3"
                  />
                  <input
                    type="text"
                    className="w-2/3 bg-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:bg-gray-100 border focus:border-gray-600"
                    value={outcome}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setOutcome(e.target.value)
                    }
                  />
                </div>
              </>
            )}

            {transactionType !== "outcome" && (
              <>
                <div className="text-xl pl-2 font-bold">Income</div>
                <div className="flex items-center my-2 gap-3">
                  <Select
                    selectedValue={incomeAccountId}
                    options={accountOptions}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setIncomeAccountId(e.target.value)
                    }
                    className="w-1/3"
                  />
                  <input
                    type="text"
                    className="w-2/3 bg-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:bg-gray-100 border focus:border-gray-600"
                    value={income}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setIncome(e.target.value)
                    }
                  />
                </div>
              </>
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

export default SetTransaction;
