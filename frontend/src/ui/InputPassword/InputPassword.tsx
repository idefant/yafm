import { forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { Except } from 'type-fest';

import { ControlExtraProps, InputControl } from '#ui/InputControl';
import { InputPasswordBase, InputPasswordBaseProps } from '#ui/InputPasswordBase';

import { InputPasswordClasses } from './inputPasswordType';

export interface InputPasswordProps
  extends Except<InputPasswordBaseProps, 'classes'>,
    ControlExtraProps {
  classes?: InputPasswordClasses;
}

export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
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
        <InputPasswordBase ref={mergeRefs([ref, localRef])} {...props} />
      </InputControl>
    );
  },
);
