import { ForwardedRef, forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { GroupBase } from 'react-select';
import ReactSelectType from 'react-select/base';

import { ControlExtraProps, InputControl } from '#ui/InputControl';
import { SelectBase, SelectBaseProps } from '#ui/SelectBase';

import { SelectClasses } from './selectType';

export interface SelectProps<
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
> extends SelectBaseProps<Option, IsMulti, Group>,
    ControlExtraProps {
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
    { label, helper, margin, classes, ...props }: SelectProps<Option, IsMulti, Group>,
    ref: ForwardedRef<ReactSelectType<Option, IsMulti, Group>>,
  ) => {
    const localRef = useRef<ReactSelectType<Option, IsMulti, Group>>();

    return (
      <InputControl
        label={label}
        inputRef={localRef as any}
        required={props.required}
        error={props.error}
        helper={helper}
        margin={margin}
        classes={classes}
      >
        <SelectBase<Option, IsMulti, Group> ref={mergeRefs([ref, localRef])} {...props} />
      </InputControl>
    );
  },
) as SelectType;

export const defaultFilterOption = (option: any, inputValue: string) =>
  option.label?.toLowerCase().includes(inputValue.toLowerCase());
