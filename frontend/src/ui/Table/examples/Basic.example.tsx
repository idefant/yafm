import { createColumnHelper, useReactTable, getCoreRowModel } from '@tanstack/react-table';

import { Table, TableProps } from '#ui/Table';

type Article = {
  id: string;
  title: string;
  date: string;
};

const defaultData: Article[] = [
  { id: '6', title: 'Article #6', date: '03.02.2024' },
  { id: '5', title: 'Article #5', date: '03.02.2024' },
  { id: '4', title: 'Article #4', date: '03.02.2024' },
  { id: '3', title: 'Article #3', date: '02.02.2024' },
  { id: '2', title: 'Article #2', date: '01.02.2024' },
  { id: '1', title: 'Article #1', date: '01.02.2024' },
];

const columnHelper = createColumnHelper<Article>();

const columns = [
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('title', {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('date', {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
];

export const BasicExample = <T,>({ fullWidth = true }: TableProps<T>) => {
  const table = useReactTable({
    data: defaultData,
    columns,
    getRowId: (original) => original.id,
    getCoreRowModel: getCoreRowModel(),
  });

  return <Table table={table} fullWidth={fullWidth} />;
};
