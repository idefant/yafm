import { createColumnHelper, getCoreRowModel, Row, useReactTable } from '@tanstack/react-table';
import { FC, useCallback, useMemo } from 'react';

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
import { dmodal, useModal } from '#ui/Modal';
import { Table } from '#ui/Table';
import { Title } from '#ui/Typography';
import { actionCreator, committer } from '#utils/committer';

const usedCurrenciesColumnHelper = createColumnHelper<Currency>();
const unusedCurrenciesColumnHelper = createColumnHelper<{ name: string; code: string }>();

export const Currencies: FC = () => {
  const currencies = useAppSelector(selectCurrencies);
  const currenciesIds = useAppSelector(selectCurrenciesIds);
  const accounts = useAppSelector(selectAllAccounts);
  const { mainCurrencyCode } = useAppSelector((state) => state.currencies);

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
        id: 'mainCurrency',
        size: 0,
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: (info) => mainCurrencyCode === info.row.original.code && <StarIcon />,
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
    [mainCurrencyCode],
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
    async (currency: Currency) => {
      if (accounts.some(({ currencyCode }) => currencyCode === currency.code)) {
        dmodal.error({
          title: 'Unable to delete currency',
          content: 'There are accounts using this currency',
          showCancel: false,
        });
        return;
      }

      if (currency.code === mainCurrencyCode) {
        dmodal.error({
          title: 'Unable to delete currency',
          content: 'This is main currency',
          showCancel: false,
        });
        return;
      }

      const modalResult = await dmodal.error({
        title: 'Delete currency',
        content: `Currency name: ${currency.name}`,
        confirmText: 'Delete',
        confirmColor: 'danger',
      });

      if (modalResult.isConfirmed) {
        committer(actionCreator.deleteCurrency(currency.code)).sync();
      }
    },
    [accounts, mainCurrencyCode],
  );

  const getRowContextMenu = useCallback(
    (row: Row<Currency>) => ({
      label: row.original.name,
      items: [
        {
          key: 'edit',
          label: 'Edit',
          icon: PencilIcon,
          onClick: () => currencyModal.open({ method: 'edit', currency: row.original }),
        },
        {
          key: 'makeMain',
          label: 'Set as main currency',
          icon: StarIcon,
          onClick: () => committer(actionCreator.setMainCurrency(row.original.code)).sync(),
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
