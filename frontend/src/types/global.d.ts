/* eslint-disable no-unused-vars */

import { FlexJustify } from '#ui/Stack';
import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    withYPadding?: boolean;
    justify?: FlexJustify;
  }
}
