import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import BigNumber from 'bignumber.js';
import { FC } from 'react';

import { useAppSelector } from '#hooks/reduxHooks';
import { selectAllTemplatesExtended } from '#store/selectors';
import { Template, TemplateExtended } from '#types/templateType';
import { Modal } from '#ui/Modal';
import { SumValueList } from '#ui/SumValueList';
import { Table } from '#ui/Table';

interface ChooseTemplateProps {
  isOpen: boolean;
  close: () => void;
  // eslint-disable-next-line no-unused-vars
  setTransaction: (template: Template) => void;
}

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

export const ChooseTemplate: FC<ChooseTemplateProps> = ({ isOpen, close, setTransaction }) => {
  const templates = useAppSelector(selectAllTemplatesExtended);

  const table = useReactTable({
    data: templates,
    columns,
    getRowId: (original) => original.id,
    getCoreRowModel: getCoreRowModel(),
  });

  const chooseTemplate = (template: Template) => {
    setTransaction(template);
    close();
  };

  return (
    <Modal title="Choose Template" isOpen={isOpen} close={close}>
      <Modal.Content>
        <Table table={table} fullWidth rowOnClick={(row) => chooseTemplate(row.original)} />
      </Modal.Content>
    </Modal>
  );
};
