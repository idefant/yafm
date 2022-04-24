import { observer } from "mobx-react-lite";
import { FC, FormEvent, useMemo } from "react";
import Button from "../Generic/Button/Button";
import FormField from "../Generic/Form/FormField";
import Select from "../Generic/Form/Select";
import Modal, {
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../Generic/Modal";
import { displayToSysValue, getCurrencyValue } from "../../helper/currencies";
import store from "../../store";
import { TAccount } from "../../types/accountType";
import { TCurrency } from "../../types/currencyType";
import useCheckForm from "../../hooks/useCheckForm";
import Checkbox from "../Generic/Form/Checkbox";
import useForm from "../../hooks/useForm";

interface SetAccountProps {
  account?: TAccount;
  isOpen: boolean;
  close: () => void;
}

const SetAccount: FC<SetAccountProps> = observer(
  ({ isOpen, close, account }) => {
    const [form, setForm, updateForm] = useForm({
      name: "",
      start_balance: "",
      currency_code: "",
      category_id: "",
    });

    const [checkForm, setCheckForm, updateCheckForm] = useCheckForm({
      is_hide: false,
      is_archive: false,
    });

    const {
      currency: { currencyDict, currencies },
      category: { accounts: categories },
    } = store;
    const accountCurrency = useMemo(
      () => currencyDict[form.currency_code],
      [currencyDict, form.currency_code]
    );

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

    const categoryOptions = categories
      .filter((category) => !category.is_archive)
      .map((category) => ({ value: category.id, text: category.name }));

    const optgroups = (() => {
      const optgroups = [];
      for (const key in currencyOptions.optgroups) {
        optgroups.push({ label: key, options: currencyOptions.optgroups[key] });
      }
      return optgroups;
    })();

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!form.name.length || !accountCurrency || !form.currency_code) return;

      const accountData = {
        name: form.name,
        start_balance: displayToSysValue(form.start_balance, accountCurrency),
        category_id: form.category_id || undefined,
        is_hide: checkForm.is_hide || undefined,
        is_archive: checkForm.is_archive || undefined,
      };

      if (account) {
        store.account.editAccount({ ...account, ...accountData });
      } else {
        store.account.createAccount({
          ...accountData,
          currency_code: form.currency_code,
        });
      }
      close();
    };

    const onEnter = () => {
      const currency = account && currencyDict[account.currency_code];

      updateForm({
        name: account?.name || "",
        start_balance: account
          ? getCurrencyValue(account.start_balance, currency)
          : "",
        currency_code: account?.currency_code || "",
        category_id: account?.category_id || "",
      });

      updateCheckForm({
        is_hide: account?.is_hide || false,
        is_archive: account?.is_archive || false,
      });
    };

    return (
      <Modal
        isOpen={isOpen}
        close={close}
        onEnter={onEnter}
        onSubmit={onSubmit}
      >
        <ModalHeader close={close}>
          {account ? "Edit Account" : "Create Account"}
        </ModalHeader>
        <ModalContent>
          <FormField
            label="Name"
            name="name"
            value={form.name}
            onChange={setForm}
          />
          {!account && (
            <div className="flex items-center my-2 gap-3">
              <label className="block w-1/3">Currency</label>
              <Select
                name="currency_code"
                selectedValue={form.currency_code}
                optgroups={optgroups}
                options={currencyOptions.options}
                onChange={setForm}
                className="w-2/3"
              />
            </div>
          )}
          <FormField
            label="Start Balance"
            name="start_balance"
            value={form.start_balance}
            onChange={setForm}
            units={accountCurrency?.code}
          />

          <div className="flex items-center my-2 gap-3">
            <label className="block w-1/3">Category</label>
            <Select
              name="category_id"
              selectedValue={form.category_id}
              options={categoryOptions}
              onChange={setForm}
              className="w-2/3"
              useEmpty
              defaultText="Choose a category"
            />
          </div>

          {account && (
            <>
              <Checkbox
                checked={checkForm.is_hide}
                onChange={setCheckForm}
                name="is_hide"
              >
                Hide
              </Checkbox>
              <Checkbox
                checked={checkForm.is_archive}
                onChange={setCheckForm}
                name="is_archive"
              >
                Archive
              </Checkbox>
            </>
          )}
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

export default SetAccount;
