import { observer } from "mobx-react-lite";
import { FC, Fragment, useMemo, useState } from "react";
import SetAccount from "../Account/SetAccount";
import { ArchiveIcon, LockIcon, PencilIcon, TrashIcon } from "../../assets/svg";
import Button from "../Generic/Button/Button";
import Table, { TBody, TD, TDIcon, TH, THead, TR } from "../Generic/Table";
import { getCurrencyValue } from "../../helper/currencies";
import store from "../../store";
import { TAccount } from "../../types/accountType";
import Swal from "sweetalert2";
import { TCurrency } from "../../types/currencyType";
import { computed } from "mobx";

const Accounts: FC = observer(() => {
  const {
    account: { accounts },
    category: { accounts: categories },
    currency: { currencies },
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

  const [openedAccount, setOpenedAccount] = useState<TAccount>();

  const openAccount = (account?: TAccount) => {
    setOpenedAccount(account);
    setIsOpen(true);
  };

  const currencyBalancesSum = useMemo(() => {
    return computed(() => {
      const currencySum = accounts.reduce(
        (currencySum: { [key: string]: number }, account: TAccount) => {
          if (account.balance !== 0) {
            currencySum[account.currency_code] =
              (account.currency_code in currencySum
                ? currencySum[account.currency_code]
                : 0) + account.balance;
          }
          return currencySum;
        },
        {}
      );

      return currencies.reduce(
        (acc: (TCurrency & { balance: number })[], currency: TCurrency) => {
          if (currency.code in currencySum)
            acc.push({ ...currency, balance: currencySum[currency.code] });
          return acc;
        },
        []
      );
    });
  }, [accounts, currencies]).get();

  const accountsWithoutCategory = accounts.filter(
    (category) => !category.category_id
  );

  const accountWithCategory = categories.map(
    (category) =>
      accountDict[category.id] && {
        id: category.id,
        name: category.name,
        accounts: accountDict[category.id]
          .slice()
          .sort((a, b) => +(a.is_archive || false) - +(b.is_archive || false)),
      }
  );

  return (
    <>
      <h1 className="text-3xl font-bold underline">Accounts!!!</h1>
      <Button color="green" onClick={() => openAccount()} className="mb-4">
        Create Account
      </Button>

      <div className="flex items-start gap-20">
        {currencyBalancesSum.length && (
          <Table>
            <THead>
              <TR>
                <TH>Currency</TH>
                <TH>Balance</TH>
              </TR>
            </THead>
            <TBody>
              {currencyBalancesSum.map((currency) => (
                <TR key={currency.code}>
                  <TD>{currency.name}</TD>
                  <TD>
                    <div className="text-right">
                      {getCurrencyValue(currency.balance, currency)}
                      <span className="pl-3">{currency.code}</span>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}

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
              {accountsWithoutCategory.map((account) => (
                <AccountItem
                  account={account}
                  openModal={() => openAccount(account)}
                  key={account.id}
                />
              ))}

              {accountWithCategory.map((category) => (
                <Fragment key={category.id}>
                  <TR>
                    <TH colSpan={6} className="!bg-orange-200 !py-1">
                      {category.name}
                    </TH>
                  </TR>
                  {category.accounts.map((account) => (
                    <AccountItem
                      account={account}
                      openModal={() => openAccount(account)}
                      key={account.id}
                    />
                  ))}
                </Fragment>
              ))}
            </TBody>
          </Table>
        ) : (
          <div className="font-sans text-3xl">¯\_(ツ)_/¯</div>
        )}
      </div>

      <SetAccount
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        account={openedAccount}
      />
    </>
  );
});

interface AccountItemProps {
  account: TAccount;
  openModal: () => void;
}

const AccountItem: FC<AccountItemProps> = observer(({ account, openModal }) => {
  const {
    currency: { currencyDict },
    transaction: { transactions, templates },
  } = store;
  const accountCurrency = currencyDict[account.currency_code];

  const checkAccountIsUsed = () => {
    for (const transaction of transactions) {
      if (
        transaction.income?.account_id === account.id ||
        transaction.outcome?.account_id === account.id
      )
        return true;
    }
    for (const template of templates) {
      if (
        template.income?.account_id === account.id ||
        template.outcome?.account_id === account.id
      )
        return true;
    }
    return false;
  };

  const confirmDelete = () => {
    checkAccountIsUsed()
      ? Swal.fire({
          title: "Unable to delete account",
          text: "There are transactions or templates using this account",
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
});

export default Accounts;
