import { createColumnHelper, getCoreRowModel, Row, useReactTable } from '@tanstack/react-table';
import BigNumber from 'bignumber.js';
import { FC, useCallback, useMemo } from 'react';
import { Except } from 'type-fest';

import { useFetchLastRatesQuery } from '#api/exratesApi';
import { HeaderInfo } from '#components/Header';
import { SetTemplate, SetTemplateModalData } from '#components/Template';
import { useAppSelector } from '#hooks/reduxHooks';
import { selectAllTransactionTemplatesCombined } from '#store/selectors';
import PencilIcon from '#svg/pencil.svg?react';
import PlusIcon from '#svg/plus.svg?react';
import TrashIcon from '#svg/trash.svg?react';
import {
  OperationCombined,
  TransactionTemplate,
  TransactionTemplateCombined,
} from '#types/transactionType';
import { Button } from '#ui/Button';
import { Card } from '#ui/Card';
import { dmodal, useModal } from '#ui/Modal';
import { SumValueList } from '#ui/SumValueList';
import { Table } from '#ui/Table';
import { Title } from '#ui/Typography';
import { actionCreator, committer } from '#utils/committer';
import money from '#utils/money';

type TransactionTemplateWithBaseSum = Except<TransactionTemplateCombined, 'operations'> & {
  baseSum: BigNumber;
  operations: (OperationCombined & { baseSum: BigNumber })[];
};

const columnHelper = createColumnHelper<TransactionTemplateWithBaseSum>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    size: Number.MAX_SAFE_INTEGER,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    size: 100,
    cell: (info) => info.getValue()?.name,
  }),
  columnHelper.accessor('operations', {
    header: 'Operations',
    size: 0,
    // eslint-disable-next-line react/no-unstable-nested-components
    cell: (info) => (
      <SumValueList
        items={info.getValue().map(({ sum, account }) => ({
          value: BigNumber(sum),
          decimalPlacesNumber: account.currency.decimal_places_number,
          currencyCode: account.currency_code,
          description: account.name,
        }))}
      />
    ),
    meta: { justify: 'end' },
  }),
];

export const Templates: FC = () => {
  const templates = useAppSelector(selectAllTransactionTemplatesCombined);
  const { baseCurrencyCode } = useAppSelector((state) => state.currencies);

  const templateModal = useModal<SetTemplateModalData>();

  const { data: prices } = useFetchLastRatesQuery({});

  const templatesWithBaseSum = useMemo(
    () =>
      templates.map((template) => {
        const operations = template.operations.map((operation) => ({
          ...operation,
          baseSum: money(operation.sum, operation.account.currency_code).to(
            baseCurrencyCode,
            prices?.rates,
          ).value,
        }));

        return {
          ...template,
          operations,
          baseSum: BigNumber.sum(...operations.map((operation) => operation.baseSum)),
        };
      }),
    [baseCurrencyCode, prices?.rates, templates],
  );

  const table = useReactTable({
    data: templatesWithBaseSum,
    columns,
    getRowId: (original) => original.id,
    getCoreRowModel: getCoreRowModel(),
  });

  const confirmDelete = useCallback(async (template: TransactionTemplate) => {
    const modalResult = await dmodal.error({
      title: 'Delete template',
      content: `Template name: ${template.name}`,
      confirmText: 'Delete',
      confirmColor: 'danger',
    });

    if (modalResult.isConfirmed) {
      committer(actionCreator.deleteTransactionTemplate(template.id)).sync();
    }
  }, []);

  const getRowContextMenu = useCallback(
    (row: Row<TransactionTemplateWithBaseSum>) => ({
      items: [
        {
          key: 'edit',
          label: 'Edit',
          icon: PencilIcon,
          onClick: () => templateModal.open({ method: 'edit', template: row.original }),
        },
        {
          key: 'delete',
          label: 'Delete',
          icon: TrashIcon,
          onClick: () => confirmDelete(row.original),
        },
      ],
    }),
    [confirmDelete, templateModal],
  );

  return (
    <>
      <HeaderInfo
        title="Templates"
        endAddition={
          <Button
            color="success"
            size="sm"
            startIcon={<PlusIcon />}
            onClick={() => templateModal.open({ method: 'create' })}
          >
            Create
          </Button>
        }
        endAdditionGap={24}
      />

      <Card>
        <Card.Content>
          <Title level={4} gutterBottom>
            List of Templates
          </Title>

          <Table
            table={table}
            fullWidth
            rowContextMenu={getRowContextMenu}
            rowOnClick={(row) => templateModal.open({ method: 'edit', template: row.original })}
          />
        </Card.Content>
      </Card>

      <SetTemplate modal={templateModal} />
    </>
  );
};
