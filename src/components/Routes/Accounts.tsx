import { observer } from "mobx-react-lite";
import { FC, Fragment, useState } from "react";
import SetAccount from "../Account/SetAccount";
import { ArchiveIcon, LockIcon, PencilIcon, TrashIcon } from "../../assets/svg";
import Button from "../Generic/Button";
import Table, { TBody, TD, TDIcon, TH, THead, TR } from "../Generic/Table";
import { getCurrencyValue } from "../../helper/currencies";
import store from "../../store";
import { TAccount } from "../../types/accountType";
import Swal from "sweetalert2";

const Accounts: FC = observer(() => {
  const {
    account: { accounts },
    category: { accounts: categories },
  } = store;
  const [isOpen, setIsOpen] = useState(false);

  const accountDict = accounts.reduce(
    (dict: { [key: string]: TAccount[] }, curr) => {
      const categoryId = curr.category_id || "";
      if (categoryId in dict) {
        dict[categoryId].push(curr);
      } else {
        dict[categoryId] = [curr];
      }
      return dict;
    },
    {}
  );

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
              <TH></TH>
              <TH></TH>
              <TH></TH>
              <TH></TH>
            </TR>
          </THead>
          <TBody>
            {accounts
              .filter((category) => !category.category_id)
              .map((account) => (
                <AccountItem account={account} key={account.id} />
              ))}
            {categories.map(
              (category) =>
                accountDict[category.id] && (
                  <Fragment key={category.id}>
                    <TR>
                      <TH colSpan={6} className="!bg-orange-200 !py-1">
                        {category.name}
                      </TH>
                    </TR>
                    {accountDict[category.id]
                      ?.slice()
                      .sort((a, b) => +a.is_archive - +b.is_archive)
                      .map((account) => (
                        <AccountItem account={account} key={account.id} />
                      ))}
                  </Fragment>
                )
            )}
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
  const {
    currency: { currencyDict },
    transaction: { transactions },
  } = store;
  const accountCurrency = currencyDict[account.currency_code];
  const [isOpen, setIsOpen] = useState(false);

  const checkAccountIsUsed = () => {
    for (const transaction of transactions) {
      if (
        transaction.income?.account_id === account.id ||
        transaction.outcome?.account_id === account.id
      )
        return true;
    }
    return false;
  };

  const confirmDelete = () => {
    checkAccountIsUsed()
      ? Swal.fire({
          title: "Unable to delete account",
          text: "There are transactions using this account",
          icon: "error",
        })
      : Swal.fire({
          title: "Delete account",
          icon: "error",
          text: account.name,
          showCancelButton: true,
          cancelButtonText: "Cancel",
          confirmButtonText: "Delete",
        }).then((result) => {
          if (result.isConfirmed) {
            store.account.deleteAccount(account.id);
          }
        });
  };

  return (
    <TR hide={account.is_archive}>
      <TD>{account.name}</TD>
      <TD className="text-right">
        {getCurrencyValue(account.balance, accountCurrency)}
        <span className="pl-3">{accountCurrency.code}</span>
      </TD>
      <TD>{account.is_hide && <LockIcon />}</TD>
      <TD>{account.is_archive && <ArchiveIcon />}</TD>
      <TDIcon>
        <button className="p-2" onClick={() => setIsOpen(true)}>
          <PencilIcon className="w-7 h-7" />
        </button>
      </TDIcon>
      <TDIcon>
        <button className="p-2" onClick={confirmDelete}>
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
