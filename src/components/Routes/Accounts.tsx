import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import dayjs from 'dayjs';
import { FC, useMemo, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import Swal from 'sweetalert2';

import { groupSum, sum } from '../../helper/arrays';
import { convertPrice, formatPrice } from '../../helper/currencies';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import useModal from '../../hooks/useModal';
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
import Table, { TColumn, TableAction, TableDate } from '../Generic/Table';
import { Title } from '../Generic/Title';

const Accounts: FC = () => {
  const accountModal = useModal();

  const {
    currency: { currencies },
    category: { accounts: categories },
    app: { safeMode, archiveMode },
    transaction: { transactions, templates },
  } = useAppSelector((state) => state);
  const accounts = useAppSelector(selectFilteredAccounts);
  const currencyDict = useAppSelector(selectCurrencyDict);
  const dispatch = useAppDispatch();

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
    accountModal.open();
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

  const accountsWithCategory = categories
    .filter((category) => accountDict[category.id])
    .map((category) => ({
      key: category.id,
      name: (
        <div className="flex justify-center gap-3 items-center">
          {category.is_hide && (<Icon.Lock className="w-[22px] h-[22px]" />)}
          {category.is_archive && (<Icon.Archive className="w-[22px] h-[22px]" />)}
          {category.name}
        </div>
      ),
      data: accountDict[category.id].sort(
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

  const checkAccountIsUsed = (accountId: string) => (
    [...transactions, ...templates].some(
      ({ operations }) => (
        operations.map((operation) => operation.account_id).includes(accountId)
      ),
    )
  );

  const confirmDelete = (account: TAccount) => {
    if (checkAccountIsUsed(account.id)) {
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

  const tableColumns: TColumn<TCalculatedAccount>[] = [
    {
      title: 'Name',
      key: 'name',
    },
    {
      title: 'Balance',
      key: 'balance',
      cellClassName: 'text-right',
      render: ({ record }) => {
        const currency = currencyDict[record.currency_code];
        return (
          <>
            {formatPrice(
              record.balance,
              currency.decimal_places_number,
            )}
            <span className="pl-3">{currency.code}</span>
          </>
        );
      },
    },
    {
      title: 'Last Activity',
      key: 'last_activity',
      render: ({ record }) => (
        record.last_activity
          ? <TableDate date={dayjs(record.last_activity)} />
          : <div className="text-center">Never</div>
      ),
    },
    {
      title: <Icon.Lock className="w-[22px] h-[22px]" />,
      key: 'is_hide',
      render: ({ record }) => record.is_hide && <Icon.Lock className="w-[22px] h-[22px]" />,
      default: '',
      hidden: safeMode,
    },
    {
      title: <Icon.Archive className="w-[22px] h-[22px]" />,
      key: 'is_archive',
      render: ({ record }) => record.is_archive && <Icon.Archive className="w-[22px] h-[22px]" />,
      default: '',
      hidden: !archiveMode,
    },
    {
      key: 'actions',
      cellClassName: '!p-0',
      render: ({ record }) => (
        <div className="flex ml-6">
          <TableAction onClick={() => openAccount(record)} icon={Icon.Pencil} />
          <TableAction onClick={() => confirmDelete(record)} icon={Icon.Trash} />
        </div>
      ),
    },
  ];

  return (
    <>
      <Title>Accounts</Title>
      <Button color="green" onClick={() => openAccount()} className="mb-4">
        Create Account
      </Button>

      <div className="flex items-start gap-20">
        {balances.length > 0 && (
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
        )}

        {accountsWithoutCategory.length || accountsWithCategory.length ? (
          <Table
            columns={tableColumns}
            isTranslucentRow={(record) => record.is_archive}
            className={{ groupName: '!bg-orange-200 !py-1' }}
            data={accountsWithoutCategory}
            dataGroups={accountsWithCategory}
          />
        ) : (
          <div className="font-sans text-3xl">¯\_(ツ)_/¯</div>
        )}
      </div>

      <SetAccount
        isOpen={accountModal.isOpen}
        close={accountModal.close}
        account={openedAccount}
      />
    </>
  );
};

export default Accounts;
