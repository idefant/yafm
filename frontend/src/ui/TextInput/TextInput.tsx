import { InputHTMLAttributes, ReactNode, forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { Except } from 'type-fest';

import { InputBase, InputBaseSize } from '#ui/InputBase';
import { InputHelperText } from '#ui/InputHelperText';
import { InputLabel } from '#ui/InputLabel';

import { TextInputClasses } from './textInputType';

interface TextInputProps
  extends Except<InputHTMLAttributes<HTMLInputElement>, 'size' | 'className' | 'prefix'> {
  label?: string;
  size?: InputBaseSize;
  error?: string | boolean;
  helper?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  classes?: TextInputClasses;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, size, error, helper, prefix, suffix, classes, ...props }, ref) => {
    const localRef = useRef<HTMLInputElement>();

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

        <InputBase
          size={size}
          error={error}
          prefix={prefix}
          suffix={suffix}
          classes={{
            container: classes?.inputContainer,
            input: classes?.input,
            prefix: classes?.prefix,
            suffix: classes?.suffix,
          }}
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
);
