import { ForwardedRef, forwardRef, useMemo } from 'react';
import { GroupBase } from 'react-select';
import ReactSelectType from 'react-select/base';
import CreatableSelect, { CreatableProps } from 'react-select/creatable';

import { SelectBaseSize } from './selectBaseType';
import { getStyles } from './style';

export interface SelectCreatableBaseProps<
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
> extends CreatableProps<Option, IsMulti, Group> {
  size?: SelectBaseSize;
  error?: string | boolean;
}

/* eslint-disable no-unused-vars */
type SelectCreatableBaseType = <
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: SelectCreatableBaseProps<Option, IsMulti, Group> & {
    ref?: ForwardedRef<ReactSelectType<Option, IsMulti, Group>>;
  },
) => JSX.Element;
/* eslint-enable no-unused-vars */

export const SelectCreatableBase = forwardRef(
  <
    Option = unknown,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>,
  >(
    { size = 'md', error, className, ...props }: SelectCreatableBaseProps<Option, IsMulti, Group>,
    ref: ForwardedRef<ReactSelectType<Option, IsMulti, Group>>,
  ) => {
    const hasError = typeof error === 'string' || !!error;

    const styles = useMemo(
      () => getStyles<Option, IsMulti, Group>({ size, hasError }),
      [hasError, size],
    );

    return (
      <CreatableSelect
        placeholder=""
        className={className}
        components={{
          IndicatorSeparator: null,
        }}
        styles={styles}
        ref={ref}
        {...props}
      />
    );
  },
) as SelectCreatableBaseType;
