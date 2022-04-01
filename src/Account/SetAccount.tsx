import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import Button from "../Generic/Button";
import FormField from "../Generic/Form/FormField";
import Modal, {
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../Generic/Modal";
import store from "../store";
import { TAccount } from "../types/account";

interface SetAccountProps {
  account?: TAccount;
  isOpen: boolean;
  close: () => void;
}

const SetAccount: FC<SetAccountProps> = ({ isOpen, close, account }) => {
  const [name, setName] = useState("");
  const [startBalance, setStartBalance] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(account?.name || "");
      setStartBalance(account?.start_balance.toString() || "");
    }
  }, [isOpen, account]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (account) {
      store.account.editAccount(account.id, name, +startBalance, false);
    } else {
      store.account.createAccount(name, +startBalance, false);
    }
    close();
  };

  return (
    <Modal isOpen={isOpen} close={close}>
      <ModalHeader close={close}>Edit Account</ModalHeader>
      <form onSubmit={onSubmit}>
        <ModalContent>
          <FormField
            label="Name"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
          <FormField
            label="Start Balance"
            value={startBalance}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setStartBalance(e.target.value)
            }
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
};

export default SetAccount;
