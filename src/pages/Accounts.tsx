import BigNumber from 'bignumber.js';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { FC, useMemo, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import Swal from 'sweetalert2';

import { useFetchLastRatesQuery } from '#api/exratesApi';
import { SetAccount } from '#components/Account';
import { useAppSelector, useAppDispatch } from '#hooks/reduxHooks';
import useModal from '#hooks/useModal';
import { deleteAccount } from '#store/reducers/accountSlice';
import { setIsUnsaved } from '#store/reducers/appSlice';
import { selectFilteredAccounts, selectCurrencyDict } from '#store/selectors';
import { TCalculatedAccount, TAccount } from '#types/accountType';
import Button from '#ui/Button';
import Card from '#ui/Card';
import Icon from '#ui/Icon';
import Table, { TColumn, TableDate, TableAction } from '#ui/Table';
import { Title } from '#ui/Title';
import group from '#utils/group';
import money from '#utils/money';

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
  const { data: prices } = useFetchLastRatesQuery();

  const baseCurrencyCode = 'BTC';

  const accountDict = group(accounts, 'category_id');

  const [openedAccount, setOpenedAccount] = useState<TAccount>();

  const openAccount = (account?: TAccount) => {
    setOpenedAccount(account);
    accountModal.open();
  };

  const currenciesWithBalance = useMemo(() => {
    const currencyBalanceDict = accounts.reduce((acc: Record<string, BigNumber>, account) => {
      acc[account.currency_code] =
        account.currency_code in acc
          ? acc[account.currency_code].plus(account.balance)
          : BigNumber(account.balance);
      return acc;
    }, {});

    return currencies
      .map((currency) => {
        const balance = currencyBalanceDict[currency.code];
        const baseBalance = money(balance, currency.code, prices?.rates).to(baseCurrencyCode).value;
        return { ...currency, balance, baseBalance };
      })
      .filter((account) => account.balance);
  }, [accounts, currencies, prices?.rates]);

  const totalAmount = useMemo(
    () => BigNumber.sum(...currenciesWithBalance.map(({ baseBalance }) => baseBalance)),
    [currenciesWithBalance],
  );

  const accountsWithoutCategory = accounts.filter((account) => !account.category_id);

  const accountsWithCategory = categories
    .filter((category) => accountDict[category.id])
    .map((category) => ({
      key: category.id,
      name: (
        <div className="flex justify-center gap-3 items-center">
          {category.is_hide && <Icon.Lock className="w-[22px] h-[22px]" />}
          {category.is_archive && <Icon.Archive className="w-[22px] h-[22px]" />}
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
      labels: currenciesWithBalance.map((currency) => currency.code),
      datasets: [
        {
          data: currenciesWithBalance.map((currency) => currency.baseBalance),
          backgroundColor: currenciesWithBalance.map((currency) => currency.color),
        },
      ],
    }),
    [currenciesWithBalance],
  );

  const currencyBalancesDict = useMemo(
    () => Object.fromEntries(currenciesWithBalance.map((balance) => [balance.code, balance])),
    [currenciesWithBalance],
  );

  const checkAccountIsUsed = (accountId: string) =>
    [...transactions, ...templates].some(({ operations }) =>
      operations.map((operation) => operation.account_id).includes(accountId),
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
          <div
            className={classNames(
              BigNumber(record.balance).isPositive() && 'text-green-500 font-bold',
              BigNumber(record.balance).isNegative() && 'text-red-500 font-bold',
            )}
          >
            {money(record.balance).format()}
            <span className="pl-3">{currency.code}</span>
          </div>
        );
      },
    },
    {
      title: 'Last Activity',
      key: 'last_activity',
      render: ({ record }) =>
        record.last_activity ? (
          <TableDate date={dayjs(record.last_activity)} />
        ) : (
          <div className="text-center">Never</div>
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
      width: 'min',
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

      <div className="grid grid-cols-3 gap-4 items-start">
        <Card>
          <Card.Header>Capital</Card.Header>
          <Card.Body>
            <div className="max-w-[300px] mx-auto">
              {currenciesWithBalance.length > 0 && (
                <Pie
                  data={data}
                  options={{
                    animation: { duration: 600 },
                    plugins: {
                      legend: {
                        labels: {
                          color: '#fff',
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: (tooltipItem) => {
                            const { balance, baseBalance } =
                              currencyBalancesDict[tooltipItem.label];
                            const percentage = baseBalance
                              .div(totalAmount)
                              .multipliedBy(100)
                              .toFixed(2);
                            const formattedBalance = money(balance).format();
                            return `${tooltipItem.label}: ${formattedBalance} - ${percentage}%`;
                          },
                        },
                      },
                    },
                  }}
                />
              )}
            </div>
          </Card.Body>
        </Card>

        <Card className="col-span-2">
          <Card.Header>List of Accounts</Card.Header>
          <Card.Body>
            <Button color="green" onClick={() => openAccount()} className="mb-2">
              Create Account
            </Button>

            <Table
              columns={tableColumns}
              isTranslucentRow={(record) => record.is_archive}
              className={{ groupName: '!bg-orange-900', table: 'w-full' }}
              data={accountsWithoutCategory}
              dataGroups={accountsWithCategory}
            />
          </Card.Body>
        </Card>
      </div>

      <SetAccount isOpen={accountModal.isOpen} close={accountModal.close} account={openedAccount} />
    </>
  );
};

export default Accounts;
