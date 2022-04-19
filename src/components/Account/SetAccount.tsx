import { observer } from "mobx-react-lite";
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import Button from "../Generic/Button";
import FormField from "../Generic/Form/FormField";
import Select from "../Generic/Form/Select";
import Modal, {
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../Generic/Modal";
import { getCurrencyValue } from "../../helper/currencies";
import store from "../../store";
import { TAccount } from "../../types/accountType";
import { TCurrency } from "../../types/currencyType";

interface SetAccountProps {
  account?: TAccount;
  isOpen: boolean;
  close: () => void;
}

const SetAccount: FC<SetAccountProps> = observer(
  ({ isOpen, close, account }) => {
    const [name, setName] = useState("");
    const [startBalance, setStartBalance] = useState("");
    const [currencyCode, setCurrencyCode] = useState<string>();

    const currencyDict = store.currency.currencyDict;
    const [accountCurrency, setAccountCurrency] = useState<TCurrency>();

    const currencies = store.currency.currencies;
    const currencyOptions = currencies.reduce(
      (
        result: {
          optgroups: {
            [type: string]: { value: string; text: string }[];
          };
          options: { value: string; text: string }[];
        },
        current: TCurrency
      ) => {
        if (current.code) {
          const option = {
            value: current.code,
            text: current.name,
          };
          if (!(current.type in result.optgroups))
            result.optgroups[current.type] = [];
          result.optgroups[current.type].push(option);
          return result;
        }
        return result;
      },
      { optgroups: {}, options: [] }
    );

    const optgroups = (() => {
      const optgroups = [];
      for (const key in currencyOptions.optgroups) {
        optgroups.push({ label: key, options: currencyOptions.optgroups[key] });
      }
      return optgroups;
    })();

    useEffect(() => {
      if (isOpen) {
        setName(account?.name || "");
        setCurrencyCode(account?.currency_code || undefined);

        const currency = account && currencyDict[account.currency_code];
        setAccountCurrency(currency);
        setStartBalance(
          account ? getCurrencyValue(account?.start_balance, currency) : ""
        );
      }
    }, [isOpen, account, currencyDict]);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!name.length || !accountCurrency) return;

      const data = {
        name,
        disabled: false,
        start_balance:
          +(
            parseFloat(startBalance) *
            10 ** accountCurrency.decimal_places_number
          ) || 0,
      };

      if (account) {
        store.account.editAccount({
          ...account,
          ...data,
        });
      } else {
        if (!currencyCode) return;

        store.account.createAccount({
          ...data,
          currency_code: currencyCode,
        });
      }
      close();
    };

    return (
      <Modal isOpen={isOpen} close={close}>
        <ModalHeader close={close}>
          {account ? "Edit Account" : "Create Account"}
        </ModalHeader>
        <form onSubmit={onSubmit}>
          <ModalContent>
            <FormField
              label="Name"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
            {!account && (
              <div className="flex items-center my-2 gap-3">
                <label className="block w-1/3">Currency</label>
                <Select
                  selectedValue={currencyCode}
                  optgroups={optgroups}
                  options={currencyOptions.options}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setCurrencyCode(e.target.value);
                    setAccountCurrency(currencyDict[e.target.value]);
                  }}
                  className="w-2/3"
                />
              </div>
            )}
            <FormField
              label="Start Balance"
              value={startBalance}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setStartBalance(e.target.value)
              }
              units={accountCurrency?.code}
            />
          </ModalContent>
          <ModalFooter>
            <Button color="green" type="submit">
              Save
            </Button>
            <Button color="gray" onClick={close}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
);

export default SetAccount;
