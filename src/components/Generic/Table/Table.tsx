import classNames from 'classnames';
import { Fragment, ReactNode } from 'react';

import Icon from '../Icon';

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
  width?: 'min';
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
    <table className={className?.table}>
      <thead className="bg-slate-100/20">
        <tr className="border-b-2 border-gray-500">
          {visibleColumns.map((column) => (
            <th
              className={classNames('px-4 py-3', column.width === 'min' && 'w-0')}
              key={column.key}
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {!(data?.length || dataGroups?.length) ? (
          <tr>
            <td colSpan={visibleColumns.length}>
              <div className="my-8 text-slate-200">
                <Icon.Search className="mx-auto w-12 h-12" />
                <div className="text-lg text-center">No Data</div>
              </div>
            </td>
          </tr>
        ) : (
          <>
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
                <tr className="border-t-2 border-gray-500">
                  <th
                    colSpan={columns.length}
                    className={classNames('bg-stone-700 py-0 px-4', className?.groupName)}
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
          </>
        )}
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

const TableRow = <T extends Record<string, any>>({
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
    <tr
      className={classNames(
        'border-t-2 border-gray-500',
        isTranslucentRow?.(row) && 'opacity-60',
        getClassName?.(row),
      )}
    >
      {visibleColumns.map((column) => (
        <td key={column.key} className={classNames('px-4 py-3', column.cellClassName)}>
          {(column.render
            ? column.render({ record: row, index })
            : (row[column.key as keyof T] as any)) ??
            column.default ?? <TableDefaultText />}
        </td>
      ))}
    </tr>
  );
};

export default Table;
