import { ForwardedRef, forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { GroupBase } from 'react-select';
import ReactSelectType from 'react-select/base';

import { ControlExtraProps, InputControl } from '#ui/InputControl';
import { SelectCreatableBase, SelectCreatableBaseProps } from '#ui/SelectBase';

import { SelectClasses } from './selectType';

export interface SelectCreatableProps<
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
> extends SelectCreatableBaseProps<Option, IsMulti, Group>,
    ControlExtraProps {
  classes?: SelectClasses;
}

/* eslint-disable no-unused-vars */
type SelectCreatableType = <
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: SelectCreatableProps<Option, IsMulti, Group> & {
    ref?: ForwardedRef<ReactSelectType<Option, IsMulti, Group>>;
  },
) => JSX.Element;
/* eslint-enable no-unused-vars */

export const SelectCreatable = forwardRef(
  <
    Option = unknown,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>,
  >(
    { label, helper, margin, classes, ...props }: SelectCreatableProps<Option, IsMulti, Group>,
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
        <SelectCreatableBase<Option, IsMulti, Group> ref={mergeRefs([ref, localRef])} {...props} />
      </InputControl>
    );
  },
) as SelectCreatableType;
