import { createColumnHelper, getCoreRowModel, Row, useReactTable } from '@tanstack/react-table';
import BigNumber from 'bignumber.js';
import { FC, useCallback } from 'react';

import { HeaderInfo } from '#components/Header';
import { SetTemplate, SetTemplateModalData } from '#components/Template';
import { useAppSelector } from '#hooks/reduxHooks';
import { selectAllTemplatesExtended } from '#store/selectors';
import PencilIcon from '#svg/pencil.svg?react';
import PlusIcon from '#svg/plus.svg?react';
import TrashIcon from '#svg/trash.svg?react';
import { TemplateExtended } from '#types/templateType';
import { Button } from '#ui/Button';
import { Card } from '#ui/Card';
import { dmodal, useModal } from '#ui/Modal';
import { SumValueList } from '#ui/SumValueList';
import { Table } from '#ui/Table';
import { Title } from '#ui/Typography';
import { actionCreator, committer } from '#utils/committer';

const columnHelper = createColumnHelper<TemplateExtended>();

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
          value: sum ? BigNumber(sum) : undefined,
          decimalPlaces: account?.currency.decimalPlaces,
          currencyCode: account?.currencyCode,
          description: account?.name,
        }))}
      />
    ),
    meta: { justify: 'end' },
  }),
];

export const Templates: FC = () => {
  const templates = useAppSelector(selectAllTemplatesExtended);

  const templateModal = useModal<SetTemplateModalData>();

  const table = useReactTable({
    data: templates,
    columns,
    getRowId: (original) => original.id,
    getCoreRowModel: getCoreRowModel(),
  });

  const confirmDelete = useCallback(async (template: TemplateExtended) => {
    const modalResult = await dmodal.error({
      title: 'Delete template',
      content: `Template name: ${template.name}`,
      confirmText: 'Delete',
      confirmColor: 'danger',
    });

    if (modalResult.isConfirmed) {
      committer(actionCreator.deleteTemplate(template.id)).sync();
    }
  }, []);

  const getRowContextMenu = useCallback(
    (row: Row<TemplateExtended>) => ({
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
