import { forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { Except } from 'type-fest';

import { InputBase, InputBaseProps } from '#ui/InputBase';
import { ControlExtraProps, InputControl } from '#ui/InputControl';

import { TextInputClasses } from './textInputType';

interface TextInputProps extends Except<InputBaseProps, 'classes'>, ControlExtraProps {
  classes?: TextInputClasses;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, helper, classes, ...props }, ref) => {
    const localRef = useRef<HTMLInputElement>();

    return (
      <InputControl
        label={label}
        inputRef={localRef}
        required={props.required}
        error={props.error}
        helper={helper}
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
