import { createColumnHelper, getCoreRowModel, Row, useReactTable } from '@tanstack/react-table';
import { FC, useCallback, useMemo } from 'react';
import Swal from 'sweetalert2';

import { useFetchCurrenciesQuery } from '#api/exratesApi';
import { SetCurrency, SetCurrencyModalData } from '#components/Currency';
import { HeaderInfo } from '#components/Header';
import { useAppSelector } from '#hooks/reduxHooks';
import { selectAllAccounts, selectCurrencies, selectCurrenciesIds } from '#store/selectors';
import PencilIcon from '#svg/pencil.svg?react';
import PlusIcon from '#svg/plus.svg?react';
import StarIcon from '#svg/star.svg?react';
import TrashIcon from '#svg/trash.svg?react';
import { Currency } from '#types/currencyType';
import { Card } from '#ui/Card';
import { Grid } from '#ui/Grid';
import { IconButton } from '#ui/IconButton';
import { useModal } from '#ui/Modal';
import { Table } from '#ui/Table';
import { Title } from '#ui/Typography';
import { actionCreator, committer } from '#utils/committer';

const usedCurrenciesColumnHelper = createColumnHelper<Currency>();
const unusedCurrenciesColumnHelper = createColumnHelper<{ name: string; code: string }>();

export const Currencies: FC = () => {
  const currencies = useAppSelector(selectCurrencies);
  const currenciesIds = useAppSelector(selectCurrenciesIds);
  const accounts = useAppSelector(selectAllAccounts);
  const { baseCurrencyCode } = useAppSelector((state) => state.currencies);

  const { data: availableCurrencies } = useFetchCurrenciesQuery();

  const currencyModal = useModal<SetCurrencyModalData>();

  const unusedCurrencies = useMemo(
    () =>
      Object.entries(availableCurrencies || {})
        .filter(([code]) => !currenciesIds.includes(code))
        .map(([code, name]) => ({ code, name })),
    [availableCurrencies, currenciesIds],
  );

  const usedCurrenciesColumns = useMemo(
    () => [
      usedCurrenciesColumnHelper.display({
        id: 'baseCurrency',
        size: 0,
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: (info) => baseCurrencyCode === info.row.original.code && <StarIcon />,
      }),
      usedCurrenciesColumnHelper.accessor('code', {
        header: 'Code',
        size: 0,
        cell: (info) => info.getValue(),
      }),
      usedCurrenciesColumnHelper.accessor('name', {
        header: 'Name',
        size: Number.MAX_SAFE_INTEGER,
        cell: (info) => info.getValue(),
      }),
    ],
    [baseCurrencyCode],
  );

  const usedCurrenciesTable = useReactTable({
    data: currencies,
    columns: usedCurrenciesColumns,
    getRowId: (original) => original.code,
    getCoreRowModel: getCoreRowModel(),
  });

  const unusedCurrenciesColumns = useMemo(
    () => [
      unusedCurrenciesColumnHelper.accessor('code', {
        header: 'Code',
        size: 0,
        cell: (info) => info.getValue(),
      }),
      unusedCurrenciesColumnHelper.accessor('name', {
        header: 'Name',
        size: Number.MAX_SAFE_INTEGER,
        cell: (info) => info.getValue(),
      }),
      unusedCurrenciesColumnHelper.display({
        id: 'actions',
        size: 0,
        maxSize: 0,
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: (info) => (
          <IconButton
            icon={PlusIcon}
            variant="outlined"
            color="secondary"
            onClick={() => currencyModal.open({ method: 'create', currency: info.row.original })}
          />
        ),
        meta: { withYPadding: false },
      }),
    ],
    [currencyModal],
  );

  const unusedCurrenciesTable = useReactTable({
    data: unusedCurrencies,
    columns: unusedCurrenciesColumns,
    getRowId: (original) => original.code,
    getCoreRowModel: getCoreRowModel(),
  });

  const confirmDelete = useCallback(
    (currency: Currency) => {
      if (accounts.some(({ currency_code: currencyCode }) => currencyCode === currency.code)) {
        Swal.fire({
          title: 'Unable to delete currency',
          text: 'There are accounts using this currency',
          icon: 'error',
        });
      } else if (currency.code === baseCurrencyCode) {
        Swal.fire({
          title: 'Unable to delete currency',
          text: 'This is base currency',
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Delete currency',
          icon: 'error',
          text: `Name: ${currency.name}`,
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Delete',
        }).then(async (result) => {
          if (result.isConfirmed) {
            committer(actionCreator.deleteCurrency(currency.code)).sync();
          }
        });
      }
    },
    [accounts, baseCurrencyCode],
  );

  const getRowContextMenu = useCallback(
    (row: Row<Currency>) => ({
      items: [
        {
          key: 'edit',
          label: 'Edit',
          icon: PencilIcon,
          onClick: () => currencyModal.open({ method: 'edit', currency: row.original }),
        },
        {
          key: 'makeBase',
          label: 'Set as base currency',
          icon: StarIcon,
          onClick: () => committer(actionCreator.setBasicCurrency(row.original.code)).sync(),
        },
        {
          key: 'delete',
          label: 'Delete',
          icon: TrashIcon,
          onClick: () => confirmDelete(row.original),
        },
      ],
    }),
    [confirmDelete, currencyModal],
  );

  return (
    <>
      <HeaderInfo title="Currencies" />

      <Grid gap={16}>
        <Grid.Item size={6}>
          <Card>
            <Card.Content>
              <Title level={4} gutterBottom>
                Added Currencies
              </Title>
              <Table
                table={usedCurrenciesTable}
                fullWidth
                rowContextMenu={getRowContextMenu}
                rowOnClick={(row) => currencyModal.open({ method: 'edit', currency: row.original })}
              />
            </Card.Content>
          </Card>
        </Grid.Item>

        <Grid.Item size={6}>
          <Card>
            <Card.Content>
              <Title level={4} gutterBottom>
                Unused Currencies
              </Title>
              <Table table={unusedCurrenciesTable} fullWidth />
            </Card.Content>
          </Card>
        </Grid.Item>
      </Grid>

      <SetCurrency modal={currencyModal} />
    </>
  );
};
