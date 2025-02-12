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
import Swal from 'sweetalert2';

import { useFetchLastRatesQuery } from '#api/exratesApi';
import { SetAccount, SetAccountModalData } from '#components/Account';
import { AccountsPie } from '#components/Account/AccountsPie';
import { HeaderInfo } from '#components/Header';
import { useAppSelector } from '#hooks/reduxHooks';
import {
  selectAccountsBalanceDict,
  selectAccountsLastActivityDict,
  selectAllTransactionTemplates,
  selectAllTransactionsCombined,
  selectCurrencyById,
  selectVisibleAccountsCombined,
} from '#store/selectors';
import ArchiveIcon from '#svg/archive.svg?react';
import PencilIcon from '#svg/pencil.svg?react';
import PlusIcon from '#svg/plus.svg?react';
import TrashIcon from '#svg/trash.svg?react';
import { AccountCombined } from '#types/accountType';
import { Button } from '#ui/Button';
import { Card } from '#ui/Card';
import { Grid } from '#ui/Grid';
import { useModal } from '#ui/Modal';
import { HStack, VStack } from '#ui/Stack';
import { SumValue } from '#ui/SumValue';
import { Table } from '#ui/Table';
import { Title, Text } from '#ui/Typography';
import { actionCreator, committer } from '#utils/committer';
import money from '#utils/money';

type AccountWithBalance = AccountCombined & {
  balance: BigNumber;
  baseBalance: BigNumber;
  lastActivity?: number;
};

const columnHelper = createColumnHelper<AccountWithBalance>();

const grouping = ['category_id'];

export const Accounts: FC = () => {
  const { baseCurrencyCode } = useAppSelector((state) => state.currencies);
  const baseCurrency = useAppSelector((state) => selectCurrencyById(state, baseCurrencyCode));
  const accounts = useAppSelector(selectVisibleAccountsCombined);
  const transactions = useAppSelector(selectAllTransactionsCombined);
  const templates = useAppSelector(selectAllTransactionTemplates);
  const accountsBalanceDict = useAppSelector(selectAccountsBalanceDict);
  const accountsLastActivityDict = useAppSelector(selectAccountsLastActivityDict);

  const { data: prices } = useFetchLastRatesQuery({});

  const accountModal = useModal<SetAccountModalData>();

  const accountsWithBalance: AccountWithBalance[] = useMemo(
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
    [accounts, accountsBalanceDict, prices?.rates, baseCurrencyCode, accountsLastActivityDict],
  );

  const totalFormattedBaseBalance = useMemo(
    () =>
      BigNumber.sum(...accountsWithBalance.map((account) => account.baseBalance)).toFormat(
        baseCurrency?.decimal_places_number,
      ),
    [accountsWithBalance, baseCurrency?.decimal_places_number],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('category_id', {}),
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
              decimalPlacesNumber={account.currency.decimal_places_number}
              currencyCode={account.currency_code}
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
    (account: AccountCombined) => {
      if (!account) return;

      const isAccountUsed = [...transactions, ...templates].some(({ operations }) =>
        operations.map((operation) => operation.account_id).includes(account.id),
      );

      if (isAccountUsed) {
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
        }).then(async (result) => {
          if (result.isConfirmed) {
            committer(actionCreator.deleteAccount(account.id)).sync();
          }
        });
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
            {row.original.category?.name || 'Без категории'}
          </Text>
          <HStack>
            <SumValue
              value={sum}
              currencyCode={baseCurrencyCode}
              decimalPlacesNumber={baseCurrency?.decimal_places_number || 2}
              color="secondary"
              size="sm"
              weight="bold"
            />
          </HStack>
        </HStack>
      );
    },
    [baseCurrency?.decimal_places_number, baseCurrencyCode],
  );

  const getRowContextMenu = useCallback(
    (row: Row<AccountWithBalance>) => ({
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
            committer(actionCreator.updateAccount(row.original.id, { is_archive: true })).sync(),
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

  return (
    <>
      <HeaderInfo
        title="Accounts"
        endAddition={
          <Button
            color="success"
            size="sm"
            startIcon={<PlusIcon />}
            onClick={() => accountModal.open({ method: 'create' })}
          >
            Create
          </Button>
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
                <Text>
                  Итоговая сумма: {totalFormattedBaseBalance} <span>{baseCurrencyCode}</span>
                </Text>
                <AccountsPie />
              </VStack>
            </Card.Content>
          </Card>
        </Grid.Item>
      </Grid>

      <SetAccount modal={accountModal} />
    </>
  );
};
