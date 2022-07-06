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
import { computed } from "mobx";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { groupSum, sum } from "../../helper/arrays";
import { Title } from "../Generic/Title";

const Accounts: FC = observer(() => {
  const {
    account: { filteredAccounts },
    category: { accounts: categories },
    currency: { currencies },
    app: { safeMode },
  } = store;
  const [isOpen, setIsOpen] = useState(false);

  const baseCurrencyCode = "btc";

  const accountDict = filteredAccounts.reduce(
    (dict: { [key: string]: TAccount[] }, account) => {
      const categoryId = account.category_id || "";

      if (!(categoryId in dict)) {
        dict[categoryId] = [];
      }
      dict[categoryId].push(account);

      return dict;
    },
    {}
  );

  const [openedAccount, setOpenedAccount] = useState<TAccount>();

  const openAccount = (account?: TAccount) => {
    setOpenedAccount(account);
    setIsOpen(true);
  };

  const currencyBalances = useMemo(() => {
    return computed(() => {
      const currencySum = groupSum(filteredAccounts, (elem) => ({
        key: elem.currency_code,
        num: elem.balance,
      }));

      return currencies
        .map((currency) => ({
          ...currency,
          balance: currencySum[currency.code],
          idealBalance: store.currency.convertPrice(
            currency.code.toLowerCase(),
            baseCurrencyCode,
            currencySum[currency.code]
          ),
        }))
        .filter((account) => account.balance);
    });
  }, [currencies, filteredAccounts]).get();

  const currencyBalancesSum = useMemo(
    () => sum(currencyBalances, (elem) => elem.idealBalance),
    [currencyBalances]
  );

  const accountsWithoutCategory = filteredAccounts.filter(
    (accounts) => !accounts.category_id
  );

  const accountWithCategory = categories
    .filter((category) => accountDict[category.id])
    .map((category) => ({
      ...category,
      accounts: accountDict[category.id].sort(
        (a, b) => +(a.is_archive || false) - +(b.is_archive || false)
      ),
    }));

  ChartJS.register(ArcElement, Tooltip, Legend);

  const data: ChartData<"pie", number[], string> = useMemo(
    () => ({
      labels: currencyBalances.map((currency) => currency.code),
      datasets: [
        {
          data: currencyBalances.map((currency) => currency.idealBalance),
          backgroundColor: currencyBalances.map((currency) => currency.color),
        },
      ],
    }),
    [currencyBalances]
  );

  return (
    <>
      <Title>Accounts</Title>
      <Button color="green" onClick={() => openAccount()} className="mb-4">
        Create Account
      </Button>

      <div className="flex items-start gap-20">
        {currencyBalances.length > 0 && (
          <div>
            <Table>
              <THead>
                <TR>
                  <TH>Currency</TH>
                  <TH>Balance</TH>
                  <TH>Percentage</TH>
                </TR>
              </THead>
              <TBody>
                {currencyBalances.map((currency) => (
                  <TR key={currency.code}>
                    <TD>{currency.name}</TD>
                    <TD>
                      <div className="text-right">
                        {getCurrencyValue(
                          currency.balance,
                          currency.decimal_places_number
                        )}
                        <span className="pl-3">{currency.code}</span>
                      </div>
                    </TD>
                    <TD>
                      {(
                        (currency.idealBalance / currencyBalancesSum) *
                        100
                      ).toFixed(2)}
                      %
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>

            <div className="w-72 my-8 mx-auto">
              <Pie data={data} options={{ animation: { duration: 600 } }} />
            </div>

            <Table className="w-full">
              <THead>
                <TR>
                  <TH>Currency</TH>
                  <TH>Result Sum</TH>
                </TR>
              </THead>
              <TBody>
                {currencies.map((currency) => (
                  <TR key={currency.code}>
                    <TD>{currency.name}</TD>
                    <TD>
                      <div className="text-right">
                        {getCurrencyValue(
                          store.currency.convertPrice(
                            baseCurrencyCode,
                            currency.code.toLowerCase(),
                            currencyBalancesSum
                          ),
                          currency.decimal_places_number
                        )}
                        <span className="pl-3">{currency.code}</span>
                      </div>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        )}

        {accountsWithoutCategory.length || accountWithCategory.length ? (
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Balance</TH>
                {!safeMode && <TH></TH>}
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
                      <div className="flex justify-center gap-3 items-center">
                        {category.is_hide && (
                          <LockIcon className="w-[22px] h-[22px]" />
                        )}
                        {category.name}
                      </div>
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
    app: { safeMode },
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
        {getCurrencyValue(
          account.balance,
          accountCurrency.decimal_places_number
        )}
        <span className="pl-3">{accountCurrency.code}</span>
      </TD>
      {!safeMode && <TD>{account.is_hide && <LockIcon />}</TD>}
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
