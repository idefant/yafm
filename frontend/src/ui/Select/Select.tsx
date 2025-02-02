import { ForwardedRef, forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { GroupBase } from 'react-select';
import ReactSelectType from 'react-select/base';

import { InputHelperText } from '#ui/InputHelperText';
import { InputLabel } from '#ui/InputLabel';
import { SelectBase, SelectBaseProps } from '#ui/SelectBase';

import { SelectClasses } from './selectType';

interface SelectProps<
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
> extends SelectBaseProps<Option, IsMulti, Group> {
  label?: string;
  error?: string | boolean;
  helper?: string;
  classes?: SelectClasses;
}

/* eslint-disable no-unused-vars */
type SelectType = <
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: SelectProps<Option, IsMulti, Group> & {
    ref?: ForwardedRef<ReactSelectType<Option, IsMulti, Group>>;
  },
) => JSX.Element;
/* eslint-enable no-unused-vars */

export const Select = forwardRef(
  <
    Option = unknown,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>,
  >(
    { label, error, helper, classes, ...props }: SelectProps<Option, IsMulti, Group>,
    ref: ForwardedRef<ReactSelectType<Option, IsMulti, Group>>,
  ) => {
    const localRef = useRef<ReactSelectType<Option, IsMulti, Group>>();

    const hasErrorText = !!(typeof error === 'string' && error);

    const focusInput = () => localRef.current?.focus();

    return (
      <div className={classes?.container}>
        {label && (
          <InputLabel
            required={props.required}
            onClick={focusInput}
            classes={{ label: classes?.label, text: classes?.labelText }}
          >
            {label}
          </InputLabel>
        )}

        <SelectBase<Option, IsMulti, Group>
          error={error}
          ref={mergeRefs([ref, localRef])}
          {...props}
        />

        {hasErrorText && (
          <InputHelperText isError className={classes?.error}>
            {error}
          </InputHelperText>
        )}
        {!hasErrorText && helper && (
          <InputHelperText className={classes?.helper}>{helper}</InputHelperText>
        )}
      </div>
    );
  },
) as SelectType;
