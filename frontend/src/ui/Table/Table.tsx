import { flexRender, Row, Table as TableType } from '@tanstack/react-table';
import classNames from 'classnames';
import { ReactNode, useRef } from 'react';

import { ContextMenu, ContextMenuItem } from '#ui/ContextMenu';
import { HStack } from '#ui/Stack';
import { TextSize } from '#ui/Typography';

import cls from './Table.module.scss';

/* eslint-disable no-unused-vars */
export interface TableProps<T> {
  table: TableType<T>;
  fullWidth?: boolean;
  renderGroupCell?: (row: Row<T>) => ReactNode;
  rowContextMenu?: (row: Row<T>) => { items: ContextMenuItem[] } | undefined;
  rowOnClick?: (row: Row<T>) => void;
  size?: 'sm' | 'md';
  headTextSize?: TextSize;
  groupTextSize?: TextSize;
  cellTextSize?: TextSize;
}
/* eslint-enable no-unused-vars */

// eslint-disable-next-line comma-spacing
export const Table = <T,>({
  table,
  fullWidth,
  renderGroupCell,
  rowContextMenu,
  rowOnClick,
  size = 'md',
  headTextSize = 'lg',
  groupTextSize = size,
  cellTextSize = size,
}: TableProps<T>) => {
  const refs = useRef<Record<string, HTMLElement | null>>({});

  return (
    <table className={classNames(cls.Table, cls[size], { [cls.fullWidth]: fullWidth })}>
      <thead className={cls.head}>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr className={cls.headRow} key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                colSpan={header.colSpan}
                className={classNames(cls.cell, cls.headCell)}
                style={{
                  width: header.getSize() === Number.MAX_SAFE_INTEGER ? 'auto' : header.getSize(),
                }}
                key={header.id}
              >
                <HStack
                  align="center"
                  justify={header.column.columnDef.meta?.justify}
                  className={classNames(cls.cellInner, cls.headCellInner, cls[headTextSize])}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </HStack>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className={cls.body}>
        {table.getRowModel().rows.map((row) => {
          if (row.getIsGrouped()) {
            const groupingValue = (() => {
              if (renderGroupCell) {
                const groupingValue = renderGroupCell(row);
                if (groupingValue) return groupingValue;
              } else if (
                typeof row.groupingValue === 'string' &&
                row.groupingValue !== 'null' &&
                row.groupingValue !== 'undefined'
              ) {
                return row.groupingValue;
              }
              return '-';
            })();
            if (!groupingValue) return;
            return (
              <tr className={cls.groupRow} key={row.id}>
                <td
                  colSpan={row.getVisibleCells().length}
                  className={classNames(cls.cell, cls.groupCell)}
                >
                  <HStack
                    align="center"
                    className={classNames(cls.cellInner, cls.groupCellInner, cls[groupTextSize])}
                  >
                    {groupingValue}
                  </HStack>
                </td>
              </tr>
            );
          }

          const contextMenu = rowContextMenu?.(row);

          return (
            <tr
              className={classNames(cls.bodyRow, { [cls.bodyRowClickable]: !!rowOnClick })}
              key={row.id}
              onClick={() => rowOnClick?.(row)}
              ref={(el) => {
                refs.current[row.id] = el;
              }}
            >
              {row.getVisibleCells().map((cell) => {
                const withYPadding = cell.column.columnDef.meta?.withYPadding ?? true;
                const width =
                  cell.column.getSize() === Number.MAX_SAFE_INTEGER
                    ? 'auto'
                    : cell.column.getSize();

                return (
                  <td
                    className={classNames(cls.cell, cls.bodyCell)}
                    style={{ width }}
                    key={cell.id}
                  >
                    <HStack
                      align="center"
                      justify={cell.column.columnDef.meta?.justify}
                      className={classNames(cls.cellInner, cls.bodyCellInner, cls[cellTextSize], {
                        [cls.bodyCellInnerWithYPadding]: withYPadding,
                      })}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </HStack>
                  </td>
                );
              })}

              {contextMenu && (
                <ContextMenu {...contextMenu} getElement={() => refs.current[row.id]} />
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
