import classNames from 'classnames';
import { Fragment, ReactNode } from 'react';

import TableDefaultText from './TableDefaultText';

/* eslint-disable no-unused-vars */
export type TColumnRender<T> = {
  record: T;
  index: number;
};

export type TColumn<T> = {
  title?: ReactNode;
  key: string;
  render?: (data: TColumnRender<T>) => ReactNode;
  cellClassName?: string;
  hidden?: boolean;
  default?: ReactNode;
};

interface TableProps<T> {
  columns: TColumn<T>[];
  data?: T[];
  dataGroups?: {
    key: string | number;
    name: ReactNode;
    data: T[];
  }[];
  getKey?: (record: T) => number | string;
  isTranslucentRow?: (record: T) => boolean | undefined;
  className?: {
    table?: string;
    row?: (record: T) => any;
    groupName?: string;
  };
}
/* eslint-enable no-unused-vars */

const Table = <T extends Record<string, any>>({
  columns,
  data,
  dataGroups,
  getKey = (record: T) => record.id,
  isTranslucentRow,
  className,
}: TableProps<T>) => {
  const visibleColumns = columns.filter((column) => !column.hidden);

  return (
    <table className={classNames('border-2 border-gray-700', className?.table)}>
      <thead>
        <tr className={classNames('border-b-2 border-gray-700', className?.groupName)}>
          {visibleColumns.map((column) => (
            <th
              className="bg-gray-200 px-4 py-3"
              key={column.key}
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map((row, index) => (
          <TableRow
            row={row}
            index={index}
            visibleColumns={visibleColumns}
            getClassName={className?.row}
            isTranslucentRow={isTranslucentRow}
            key={getKey(row)}
          />
        ))}
        {dataGroups?.map((dataGroup) => (
          <Fragment key={dataGroup.key}>
            <tr className="border-b-2 border-gray-700">
              <th
                colSpan={columns.length}
                className={classNames('bg-stone-300 py-0 px-4', className?.groupName)}
              >
                {dataGroup.name}
              </th>
            </tr>
            {dataGroup.data.map((row, index) => (
              <TableRow
                row={row}
                index={index}
                visibleColumns={visibleColumns}
                getClassName={className?.row}
                isTranslucentRow={isTranslucentRow}
                key={getKey(row)}
              />
            ))}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
};

/* eslint-disable no-unused-vars */
interface TableRowProps<T> {
  row: T;
  index: number;
  visibleColumns: TColumn<T>[];
  getClassName?: (record: T) => any;
  isTranslucentRow?: (record: T) => boolean | undefined;
}
/* eslint-enable no-unused-vars */

const TableRow = <T, >({
  row,
  index,
  visibleColumns,
  getClassName,
  isTranslucentRow,
}: TableRowProps<T>) => {
  let rowClassName = getClassName?.(row);
  if (rowClassName instanceof String || typeof rowClassName !== 'string') {
    rowClassName = undefined;
  }

  return (
    <tr className={classNames(
      'border-b-2 border-gray-700',
      isTranslucentRow?.(row) && 'opacity-60',
      getClassName?.(row),
    )}
    >
      {visibleColumns.map((column) => (
        <td key={column.key} className={classNames('bg-gray-100 px-4 py-3', column.cellClassName)}>
          {(column.render
            ? column.render({ record: row, index })
            : row[column.key as keyof T] as any)
          ?? column.default
          ?? <TableDefaultText />}
        </td>
      ))}
    </tr>
  );
};

export default Table;
