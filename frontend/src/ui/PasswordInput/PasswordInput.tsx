import { forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { Except } from 'type-fest';

import { ControlExtraProps, InputControl } from '#ui/InputControl';
import { PasswordInputBase, PasswordInputBaseProps } from '#ui/PasswordInputBase';

import { PasswordInputClasses } from './passwordInputType';

interface PasswordInputProps extends Except<PasswordInputBaseProps, 'classes'>, ControlExtraProps {
  classes?: PasswordInputClasses;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
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
        <PasswordInputBase ref={mergeRefs([ref, localRef])} {...props} />
      </InputControl>
    );
  },
);
