import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import SetAccount from "../Account/SetAccount";
import { PencilIcon, TrashIcon } from "../assets/svg";
import Button from "../Generic/Button";
import Table, { TBody, TD, TDIcon, TH, THead, TR } from "../Generic/Table";
import { getCurrencyValue } from "../helper/currencies";
import store from "../store";
import { TAccount } from "../types/accountType";

const Accounts: FC = observer(() => {
  const accounts = store.account.accounts;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <h1 className="text-3xl font-bold underline">Accounts!!!</h1>
      <Button color="green" onClick={() => setIsOpen(true)}>
        Create Account
      </Button>

      {accounts.length ? (
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Balance</TH>
              <TH>Currency</TH>
              <TH></TH>
              <TH></TH>
            </TR>
          </THead>
          <TBody>
            {accounts.map((account) => (
              <AccountItem account={account} key={account.id} />
            ))}
          </TBody>
        </Table>
      ) : (
        <div className="font-sans text-3xl">¯\_(ツ)_/¯</div>
      )}

      <SetAccount isOpen={isOpen} close={() => setIsOpen(false)} />
    </>
  );
});

interface AccountItemProps {
  account: TAccount;
}

const AccountItem: FC<AccountItemProps> = observer(({ account }) => {
  const currencyDict = store.currency.currencyDict;
  const accountCurrency = currencyDict[account.currency_code];
  const [isOpen, setIsOpen] = useState(false);

  const deleteAccount = () => {
    store.app.closeAlert();
    store.account.deleteAccount(account.id);
  };

  const showDeleteModal = () => {
    store.app.openAlert({
      title: "Delete Account",
      type: "error",
      buttons: [
        { text: "Confirm", color: "red", onClick: deleteAccount },
        { text: "Cancel", onClick: () => store.app.closeAlert() },
      ],
    });
  };

  return (
    <TR>
      <TD>{account.name}</TD>
      <TD>
        {getCurrencyValue(account.balance, accountCurrency)}{" "}
        {accountCurrency?.symbol || accountCurrency?.code || ""}
      </TD>
      <TD>{accountCurrency.code}</TD>
      <TDIcon>
        <button className="p-2" onClick={() => setIsOpen(true)}>
          <PencilIcon className="w-7 h-7" />
        </button>
      </TDIcon>
      <TDIcon>
        <button className="p-2" onClick={showDeleteModal}>
          <TrashIcon className="w-7 h-7" />
        </button>
      </TDIcon>

      <SetAccount
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        account={account}
      />
    </TR>
  );
});

export default Accounts;
