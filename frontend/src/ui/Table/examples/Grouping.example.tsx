import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
} from '@tanstack/react-table';
import { FC } from 'react';
import { Except } from 'type-fest';

import { Table, TableProps } from '#ui/Table';

type Article = {
  id: string;
  title: string;
  date?: string;
};

const defaultData: Article[] = [
  { id: '6', title: 'Article #6', date: '03.02.2024' },
  { id: '5', title: 'Article #5', date: '03.02.2024' },
  { id: '4', title: 'Article #4', date: '03.02.2024' },
  { id: '7', title: 'Article #3' },
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

const grouping = ['date'];

export const GroupingExample: FC<Except<TableProps<Article>, 'table'>> = (props) => {
  const table = useReactTable({
    groupedColumnMode: 'remove',
    state: {
      grouping,
      expanded: true,
    },
    data: defaultData,
    columns,
    getRowId: (original) => original.id,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return <Table table={table} {...props} />;
};
