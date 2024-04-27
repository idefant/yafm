import classNames from 'classnames';
import dayjs from 'dayjs';
import { FC, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

import { useFetchLastRatesQuery } from '#api/exratesApi';
import { SetAccount } from '#components/Account';
import AccountsPie from '#components/Account/AccountsPie';
import { baseCurrencyCode } from '#data/defaultCurrencies';
import { useAppSelector, useAppDispatch } from '#hooks/reduxHooks';
import useModal from '#hooks/useModal';
import { accountDeleted } from '#store/reducers/accountsSlice';
import { setIsUnsaved } from '#store/reducers/appSlice';
import {
  selectAccountsBalanceDict,
  selectAccountsLastActivityDict,
  selectAllTransactionTemplates,
  selectAllTransactionsCombined,
  selectVisibleAccountCategories,
  selectVisibleAccountsCombined,
} from '#store/selectors';
import { TAccount } from '#types/accountType';
import Button from '#ui/Button';
import Card from '#ui/Card';
import Icon from '#ui/Icon';
import Table, { TColumn, TableDate, TableAction } from '#ui/Table';
import { Title } from '#ui/Title';
import { groupBy } from '#utils/groupBy';
import money from '#utils/money';

const Accounts: FC = () => {
  const { archiveMode } = useAppSelector((state) => state.app);
  const accounts = useAppSelector(selectVisibleAccountsCombined);
  const transactions = useAppSelector(selectAllTransactionsCombined);
  const templates = useAppSelector(selectAllTransactionTemplates);
  const categories = useAppSelector(selectVisibleAccountCategories);
  const accountsBalanceDict = useAppSelector(selectAccountsBalanceDict);
  const accountsLastActivityDict = useAppSelector(selectAccountsLastActivityDict);
  const dispatch = useAppDispatch();
  const { data: prices } = useFetchLastRatesQuery();

  const accountModal = useModal();

  const [openedAccount, setOpenedAccount] = useState<TAccount>();

  const openAccount = (account?: TAccount) => {
    setOpenedAccount(account);
    accountModal.open();
  };

  const accountsWithBalance = useMemo(
    () =>
      accounts.map((account) => ({
        ...account,
        balance: accountsBalanceDict[account.id]!,
        baseBalance: money(
          accountsBalanceDict[account.id]!,
          account.currency.code,
          prices?.rates,
        ).to(baseCurrencyCode).value,
        lastActivity: accountsLastActivityDict[account.id],
      })),
    [accounts, accountsBalanceDict, prices?.rates, accountsLastActivityDict],
  );

  const { accountsWithoutCategory, accountsGroupedByCategory } = useMemo(() => {
    const { undefined: accountsWithoutCategory, ...accountsWithCategory } = groupBy(
      accountsWithBalance,
      (account) => {
        if (!account.category || (account.category.is_archive && !archiveMode)) return undefined;
        return account.category_id;
      },
    );

    const accountsGroupedByCategory = categories
      .filter((category) => category.id in accountsWithCategory)
      .map((category) => ({
        key: category.id,
        name: (
          <div className="flex justify-center gap-3 items-center">
            {category.is_archive && <Icon.Archive className="w-[22px] h-[22px]" />}
            {category.name}
          </div>
        ),
        data: accountsWithCategory[category.id].sort(
          (a, b) => +(a.is_archive || false) - +(b.is_archive || false),
        ),
      }));

    return { accountsWithoutCategory, accountsGroupedByCategory };
  }, [accountsWithBalance, archiveMode, categories]);

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
          dispatch(accountDeleted(account.id));
          dispatch(setIsUnsaved(true));
        }
      });
    }
  };

  const tableColumns: TColumn<(typeof accountsWithBalance)[number]>[] = [
    {
      title: 'Name',
      key: 'name',
    },
    {
      title: 'Balance',
      key: 'balance',
      cellClassName: 'text-right',
      render: ({ record }) => (
        <div
          className={classNames(
            record.balance.gt(0) && 'text-green-500 font-bold',
            record.balance.eq(0) && 'text-gray-400',
            record.balance.lt(0) && 'text-red-500 font-bold',
          )}
        >
          {money(record.balance).format()}
          <span className="pl-3">{record.currency.code}</span>
        </div>
      ),
    },
    {
      title: 'Last Activity',
      key: 'last_activity',
      render: ({ record }) =>
        record.lastActivity ? (
          <TableDate date={dayjs(record.lastActivity)} />
        ) : (
          <div className="text-center">Never</div>
        ),
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
              <AccountsPie />
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
              dataGroups={accountsGroupedByCategory}
            />
          </Card.Body>
        </Card>
      </div>

      <SetAccount isOpen={accountModal.isOpen} close={accountModal.close} account={openedAccount} />
    </>
  );
};

export default Accounts;
