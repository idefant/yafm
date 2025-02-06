import { forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { Except } from 'type-fest';

import { ControlExtraProps, InputControl } from '#ui/InputControl';
import { InputNumberBase, InputNumberBaseProps } from '#ui/InputNumberBase';

import { InputNumberClasses } from './inputNumberType';

export interface InputNumberProps
  extends Except<InputNumberBaseProps, 'classes'>,
    ControlExtraProps {
  classes?: InputNumberClasses;
}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  ({ label, helper, margin, classes, ...props }, ref) => {
    const localRef = useRef<HTMLInputElement>();

    return (
      <InputControl
        label={label}
        inputRef={localRef}
        required={props.required}
        error={props.error}
        helper={helper}
        margin={margin}
        classes={classes}
      >
        <InputNumberBase ref={mergeRefs([ref, localRef])} {...props} />
      </InputControl>
    );
  },
);
