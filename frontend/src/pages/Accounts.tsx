import {
  createColumnHelper,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import { FC, useCallback, useMemo } from 'react';

import { useFetchLastRatesQuery } from '#api/exratesApi';
import { SetAccount, SetAccountModalData } from '#components/Account';
import { AccountsPie } from '#components/Account/AccountsPie';
import {
  confirmAccountGroupDeletion,
  SetAccountGroupModal,
  SetAccountGroupModalData,
} from '#components/AccountGroup';
import { HeaderInfo } from '#components/Header';
import { appRoutes } from '#data/routes';
import { useAppSelector } from '#hooks/reduxHooks';
import {
  selectAccountsBalanceDict,
  selectAccountsLastActivityDict,
  selectAllTemplates,
  selectAllTransactionsExtended,
  selectCurrencyById,
  selectVisibleAccountsExtended,
} from '#store/selectors';
import ArchiveIcon from '#svg/archive.svg?react';
import ListIcon from '#svg/list.svg?react';
import PencilIcon from '#svg/pencil.svg?react';
import PlusIcon from '#svg/plus.svg?react';
import TrashIcon from '#svg/trash.svg?react';
import { AccountExtended } from '#types/accountType';
import { Button } from '#ui/Button';
import { Card } from '#ui/Card';
import { Grid } from '#ui/Grid';
import { dmodal, useModal } from '#ui/Modal';
import { HStack, VStack } from '#ui/Stack';
import { SumValue } from '#ui/SumValue';
import { Table } from '#ui/Table';
import { Title, Text } from '#ui/Typography';
import { actionCreator, committer } from '#utils/committer';
import money from '#utils/money';

type AccountWithBalance = AccountExtended & {
  balance: BigNumber;
  baseBalance: BigNumber;
  lastActivity?: number;
};

const columnHelper = createColumnHelper<AccountWithBalance>();

const grouping = ['groupId'];

export const Accounts: FC = () => {
  const { mainCurrencyCode } = useAppSelector((state) => state.currencies);
  const mainCurrency = useAppSelector((state) => selectCurrencyById(state, mainCurrencyCode));
  const accounts = useAppSelector(selectVisibleAccountsExtended);
  const transactions = useAppSelector(selectAllTransactionsExtended);
  const templates = useAppSelector(selectAllTemplates);
  const accountsBalanceDict = useAppSelector(selectAccountsBalanceDict);
  const accountsLastActivityDict = useAppSelector(selectAccountsLastActivityDict);

  const { data: prices } = useFetchLastRatesQuery({});

  const accountModal = useModal<SetAccountModalData>();
  const groupModal = useModal<SetAccountGroupModalData>();

  const accountsWithBalance: AccountWithBalance[] = useMemo(
    () =>
      accounts.map((account) => ({
        ...account,
        balance: accountsBalanceDict[account.id]!,
        baseBalance: money(
          accountsBalanceDict[account.id]!,
          account.currency.code,
          prices?.rates,
        ).to(mainCurrencyCode).value,
        lastActivity: accountsLastActivityDict[account.id],
      })),
    [accounts, accountsBalanceDict, prices?.rates, mainCurrencyCode, accountsLastActivityDict],
  );

  const totalFormattedBaseBalance = useMemo(
    () => BigNumber.sum(...accountsWithBalance.map((account) => account.baseBalance)),
    [accountsWithBalance],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('groupId', {}),
      columnHelper.accessor('name', {
        header: 'Name',
        size: Number.MAX_SAFE_INTEGER,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('lastActivity', {
        header: 'Last Activity',
        size: 120,
        cell: (info) => {
          const value = info.getValue();
          return value ? dayjs(value).format('DD.MM.YYYY') : 'Never';
        },
      }),
      columnHelper.accessor('balance', {
        header: 'Balance',
        size: 0,
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: (info) => {
          const account = info.row.original;
          return (
            <SumValue
              value={info.getValue()}
              decimalPlaces={account.currency.decimalPlaces}
              currencyCode={account.currencyCode}
            />
          );
        },
        meta: {
          justify: 'end',
        },
      }),
    ],
    [],
  );

  const table = useReactTable({
    groupedColumnMode: 'remove',
    state: {
      grouping,
      expanded: true,
    },
    data: accountsWithBalance,
    columns,
    getRowId: (original) => original.id,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const confirmDelete = useCallback(
    async (account: AccountExtended) => {
      if (!account) return;

      const isAccountUsed = [...transactions, ...templates].some(({ operations }) =>
        operations.map((operation) => operation.accountId).includes(account.id),
      );

      if (isAccountUsed) {
        dmodal.error({
          title: 'Unable to delete account',
          content: 'There are transactions or templates using this account',
          showCancel: false,
        });
        return;
      }

      const modalResult = await dmodal.error({
        title: 'Delete account',
        content: `Account name: ${account.name}`,
        confirmText: 'Delete',
        confirmColor: 'danger',
      });

      if (modalResult.isConfirmed) {
        committer(actionCreator.deleteAccount(account.id)).sync();
      }
    },
    [templates, transactions],
  );

  const renderGroupCell = useCallback(
    (row: Row<AccountWithBalance>) => {
      const sum = BigNumber.sum(...row.subRows.map((subRow) => subRow.original.baseBalance));
      return (
        <HStack justify="spaceBetween" grow={1}>
          <Text color="secondary" size="sm" weight="bold">
            {row.original.group?.name || 'Без категории'}
          </Text>
          <HStack>
            <SumValue
              value={sum}
              currencyCode={mainCurrencyCode}
              decimalPlaces={mainCurrency?.decimalPlaces}
              color="secondary"
              size="sm"
              weight="bold"
            />
          </HStack>
        </HStack>
      );
    },
    [mainCurrency?.decimalPlaces, mainCurrencyCode],
  );

  const getRowContextMenu = useCallback(
    (row: Row<AccountWithBalance>) => ({
      label: row.original.name,
      items: [
        {
          key: 'edit',
          label: 'Edit',
          icon: PencilIcon,
          onClick: () => accountModal.open({ method: 'edit', account: row.original }),
        },
        {
          key: 'archive',
          label: 'Archive',
          icon: ArchiveIcon,
          onClick: () =>
            committer(actionCreator.updateAccount(row.original.id, { isArchived: true })).sync(),
        },
        {
          key: 'delete',
          label: 'Delete',
          icon: TrashIcon,
          onClick: () => confirmDelete(row.original),
        },
      ],
    }),
    [accountModal, confirmDelete],
  );

  const getGroupContextMenu = useCallback(
    (row: Row<AccountWithBalance>) => {
      const { group } = row.original;
      if (!group) return;

      return {
        label: group.name,
        items: [
          {
            key: 'edit',
            label: 'Edit',
            icon: PencilIcon,
            onClick: () => groupModal.open({ method: 'edit', group }),
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: TrashIcon,
            onClick: () => confirmAccountGroupDeletion(group),
          },
        ],
      };
    },
    [groupModal],
  );

  return (
    <>
      <HeaderInfo
        title="Accounts"
        endAddition={
          <HStack gap={16}>
            <Button
              color="success"
              size="sm"
              startIcon={<PlusIcon />}
              onClick={() => accountModal.open({ method: 'create' })}
            >
              Create
            </Button>
            <Button size="sm" startIcon={<ListIcon />} to={appRoutes.accountGroups}>
              Groups
            </Button>
          </HStack>
        }
        endAdditionGap={24}
      />

      <Grid gap={16}>
        <Grid.Item size={8}>
          <Card>
            <Card.Content>
              <Title level={4} gutterBottom>
                List of Accounts
              </Title>

              <Table
                table={table}
                fullWidth
                renderGroupCell={renderGroupCell}
                rowContextMenu={getRowContextMenu}
                groupContextMenu={getGroupContextMenu}
                rowOnClick={(row) => accountModal.open({ method: 'edit', account: row.original })}
              />
            </Card.Content>
          </Card>
        </Grid.Item>

        <Grid.Item size={4}>
          <Card>
            <Card.Content>
              <Title level={4} gutterBottom>
                Capital
              </Title>
              <VStack gap={16}>
                <HStack>
                  <Text>Итоговая сумма:</Text>
                  <SumValue value={totalFormattedBaseBalance} currencyCode={mainCurrencyCode} />
                </HStack>
                <AccountsPie />
              </VStack>
            </Card.Content>
          </Card>
        </Grid.Item>
      </Grid>

      <SetAccount modal={accountModal} />
      <SetAccountGroupModal modal={groupModal} />
    </>
  );
};
