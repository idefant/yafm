import { FC, Fragment, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Pie } from "react-chartjs-2";

import SetAccount from "../Account/SetAccount";
import { ArchiveIcon, LockIcon, PencilIcon, TrashIcon } from "../../assets/svg";
import Button from "../Generic/Button/Button";
import Table, { TBody, TD, TDIcon, TH, THead, TR } from "../Generic/Table";
import { convertPrice, getCurrencyValue } from "../../helper/currencies";
import { TAccount, TCalculatedAccount } from "../../types/accountType";
import { groupSum, sum } from "../../helper/arrays";
import { Title } from "../Generic/Title";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  selectCurrencyDict,
  selectFilteredAccounts,
} from "../../store/selectors";
import { deleteAccount } from "../../store/reducers/accountSlice";
import { setIsUnsaved } from "../../store/reducers/appSlice";

const Accounts: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    currency: { currencies },
    category: { accounts: categories },
    app: { safeMode },
  } = useAppSelector((state) => state);
  const accounts = useAppSelector(selectFilteredAccounts);

  const baseCurrencyCode = "btc";

  const accountDict = accounts.reduce(
    (dict: { [key: string]: TCalculatedAccount[] }, account) => {
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
    const currencySum = groupSum(accounts, (elem) => ({
      key: elem.currency_code,
      num: elem.balance,
    }));

    return currencies
      .map((currency) => ({
        ...currency,
        balance: currencySum[currency.code],
        idealBalance: convertPrice(
          currency.code.toLowerCase(),
          baseCurrencyCode,
          currencySum[currency.code]
        ),
      }))
      .filter((account) => account.balance);
  }, [currencies, accounts]);

  const currencyBalancesSum = useMemo(
    () => sum(currencyBalances, (elem) => elem.idealBalance),
    [currencyBalances]
  );

  const accountsWithoutCategory = accounts.filter(
    (account) => !account.category_id
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
                          convertPrice(
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
};

interface AccountItemProps {
  account: TCalculatedAccount;
  openModal: () => void;
}

const AccountItem: FC<AccountItemProps> = ({ account, openModal }) => {
  const currencyDict = useAppSelector(selectCurrencyDict);
  const {
    transaction: { transactions, templates },
    app: { safeMode },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

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
            dispatch(deleteAccount(account.id));
            dispatch(setIsUnsaved(true));
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
};

export default Accounts;
