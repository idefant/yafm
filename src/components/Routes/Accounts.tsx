import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import {
  FC, Fragment, useMemo, useState,
} from 'react';
import { Pie } from 'react-chartjs-2';
import Swal from 'sweetalert2';

import { groupSum, sum } from '../../helper/arrays';
import { convertPrice, formatPrice } from '../../helper/currencies';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { deleteAccount } from '../../store/reducers/accountSlice';
import { setIsUnsaved } from '../../store/reducers/appSlice';
import {
  selectCurrencyDict,
  selectFilteredAccounts,
} from '../../store/selectors';
import { TAccount, TCalculatedAccount } from '../../types/accountType';
import { TCurrency } from '../../types/currencyType';
import SetAccount from '../Account/SetAccount';
import Button from '../Generic/Button/Button';
import Icon from '../Generic/Icon';
import Table, {
  TBody, TD, TDIcon, TH, THead, TR,
} from '../Generic/Table';
import { Title } from '../Generic/Title';

const Accounts: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    currency: { currencies },
    category: { accounts: categories },
    app: { safeMode },
  } = useAppSelector((state) => state);
  const accounts = useAppSelector(selectFilteredAccounts);

  const baseCurrencyCode = 'btc';

  const accountDict = accounts.reduce(
    (dict: { [key: string]: TCalculatedAccount[] }, account) => {
      const categoryId = account.category_id || '';
      // eslint-disable-next-line no-param-reassign
      if (!(categoryId in dict)) dict[categoryId] = [];
      dict[categoryId].push(account);
      return dict;
    },
    {},
  );

  const [openedAccount, setOpenedAccount] = useState<TAccount>();

  const openAccount = (account?: TAccount) => {
    setOpenedAccount(account);
    setIsOpen(true);
  };

  type TBalance = TCurrency & {
    balance: number;
    idealBalance: number;
    formattedBalance: string;
  };

  const balances: TBalance[] = useMemo(() => {
    const currencySum = groupSum(accounts, (elem) => ({
      key: elem.currency_code,
      num: elem.balance,
    }));

    return currencies
      .map((currency) => {
        const balance = currencySum[currency.code];
        const idealBalance = convertPrice(currency.code.toLowerCase(), baseCurrencyCode, balance);
        const formattedBalance = formatPrice(balance, currency.decimal_places_number);
        return {
          ...currency,
          balance,
          formattedBalance,
          idealBalance,
        };
      })
      .filter((account) => account.balance);
  }, [currencies, accounts]);

  const totalAmount = useMemo(
    () => sum(balances, (elem) => elem.idealBalance),
    [balances],
  );

  const accountsWithoutCategory = accounts.filter(
    (account) => !account.category_id,
  );

  const accountWithCategory = categories
    .filter((category) => accountDict[category.id])
    .map((category) => ({
      ...category,
      accounts: accountDict[category.id].sort(
        (a, b) => +(a.is_archive || false) - +(b.is_archive || false),
      ),
    }));

  ChartJS.register(ArcElement, Tooltip, Legend);

  const data: ChartData<'pie', any, string> = useMemo(
    () => ({
      labels: balances.map((currency) => currency.code),
      datasets: [
        {
          data: balances.map((currency) => currency.idealBalance),
          backgroundColor: balances.map((currency) => currency.color),
        },
      ],
    }),
    [balances],
  );

  const currencyBalancesDict = useMemo(() => (
    balances.reduce((dict: { [curCode: string]: TBalance }, currency) => {
      // eslint-disable-next-line no-param-reassign
      dict[currency.code] = currency;
      return dict;
    }, {})
  ), [balances]);

  return (
    <>
      <Title>Accounts</Title>
      <Button color="green" onClick={() => openAccount()} className="mb-4">
        Create Account
      </Button>

      <div className="flex items-start gap-20">
        {balances.length > 0 && (
          <div>
            <div className="w-72 my-8 mx-auto">
              <Pie
                data={data}
                options={{
                  animation: { duration: 600 },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (tooltipItem) => {
                          const {
                            formattedBalance,
                            idealBalance,
                          } = currencyBalancesDict[tooltipItem.label];
                          const percentage = ((idealBalance / totalAmount) * 100).toFixed(2);
                          return `${tooltipItem.label}: ${formattedBalance} - ${percentage}%`;
                        },
                      },
                    },
                  },
                }}
              />
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
                        {formatPrice(
                          convertPrice(baseCurrencyCode, currency.code.toLowerCase(), totalAmount),
                          currency.decimal_places_number,
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
                {!safeMode && <TH />}
                <TH />
                <TH />
                <TH />
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
                          <Icon.Lock className="w-[22px] h-[22px]" />
                        )}
                        {category.is_archive && (
                          <Icon.Archive className="w-[22px] h-[22px]" />
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

  const checkAccountIsUsed = () => (
    [...transactions, ...templates].some(
      ({ operations }) => (
        operations.map((operation) => operation.account_id).includes(account.id)
      ),
    )
  );

  const confirmDelete = () => {
    if (checkAccountIsUsed()) {
      Swal.fire({
        title: 'Unable to delete account',
        text: 'There are transactions or templates using this account',
        icon: 'error',
      });
    } else {
      Swal.fire({
        title: 'Delete account',
        icon: 'error',
        text: account.name,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete',
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteAccount(account.id));
          dispatch(setIsUnsaved(true));
        }
      });
    }
  };

  return (
    <TR hide={account.is_archive}>
      <TD>{account.name}</TD>
      <TD className="text-right">
        {formatPrice(
          account.balance,
          accountCurrency.decimal_places_number,
        )}
        <span className="pl-3">{accountCurrency.code}</span>
      </TD>
      {!safeMode && (
        <TD>{account.is_hide && <Icon.Lock />}</TD>
      )}
      <TD>{account.is_archive && <Icon.Archive />}</TD>
      <TDIcon>
        <button className="p-2" onClick={openModal} type="button">
          <Icon.Pencil className="w-7 h-7" />
        </button>
      </TDIcon>
      <TDIcon>
        <button className="p-2" onClick={confirmDelete} type="button">
          <Icon.Trash className="w-7 h-7" />
        </button>
      </TDIcon>
    </TR>
  );
};

export default Accounts;
