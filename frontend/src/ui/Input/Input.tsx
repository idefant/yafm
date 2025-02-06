import { forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { Except } from 'type-fest';

import { InputBase, InputBaseProps } from '#ui/InputBase';
import { ControlExtraProps, InputControl } from '#ui/InputControl';

import { InputClasses } from './inputType';

export interface InputProps extends Except<InputBaseProps, 'classes'>, ControlExtraProps {
  classes?: InputClasses;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
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
        <InputBase
          classes={{
            container: classes?.inputContainer,
            input: classes?.input,
            prefix: classes?.prefix,
            suffix: classes?.suffix,
          }}
          ref={mergeRefs([ref, localRef])}
          {...props}
        />
      </InputControl>
    );
  },
);
