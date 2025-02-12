import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import BigNumber from 'bignumber.js';
import { FC } from 'react';

import { useAppSelector } from '#hooks/reduxHooks';
import { selectAllTransactionTemplatesCombined } from '#store/selectors';
import { TransactionTemplate, TransactionTemplateCombined } from '#types/transactionType';
import { Modal } from '#ui/Modal';
import { SumValueList } from '#ui/SumValueList';
import { Table } from '#ui/Table';

interface ChooseTemplateProps {
  isOpen: boolean;
  close: () => void;
  // eslint-disable-next-line no-unused-vars
  setTransaction: (template: TransactionTemplate) => void;
}

const columnHelper = createColumnHelper<TransactionTemplateCombined>();

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

export const ChooseTemplate: FC<ChooseTemplateProps> = ({ isOpen, close, setTransaction }) => {
  const templates = useAppSelector(selectAllTransactionTemplatesCombined);

  const table = useReactTable({
    data: templates,
    columns,
    getRowId: (original) => original.id,
    getCoreRowModel: getCoreRowModel(),
  });

  const chooseTemplate = (template: TransactionTemplate) => {
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
