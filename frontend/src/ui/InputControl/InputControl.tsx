import { FC, ReactNode, Ref } from 'react';

import { InputHelperText } from '#ui/InputHelperText';
import { InputLabel } from '#ui/InputLabel';

import { InputControlClasses } from './inputControlType';

export type ControlExtraProps = {
  label?: string;
  required?: boolean;
  error?: string | boolean;
  helper?: string;
};

interface InputControlProps extends ControlExtraProps {
  inputRef?: Ref<HTMLElement | undefined>;
  classes?: InputControlClasses;
  children: ReactNode;
}

export const InputControl: FC<InputControlProps> = ({
  label,
  inputRef,
  required,
  error,
  helper,
  classes,
  children,
}) => {
  const hasErrorText = !!(typeof error === 'string' && error);

  const focusInput = () => inputRef && 'current' in inputRef && inputRef.current?.focus();

  return (
    <div className={classes?.container}>
      {label && (
        <InputLabel
          required={required}
          onClick={focusInput}
          classes={{ label: classes?.label, text: classes?.labelText }}
        >
          {label}
        </InputLabel>
      )}

      {children}

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
};
