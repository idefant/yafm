import classNames from 'classnames';
import { FC, ReactNode, Ref } from 'react';

import { InputMargin } from '#types/inputType';
import { InputHelperText } from '#ui/InputHelperText';
import { InputLabel } from '#ui/InputLabel';

import cls from './InputControl.module.scss';
import { InputControlClasses } from './inputControlType';

export type ControlExtraProps = {
  label?: string;
  required?: boolean;
  error?: string | boolean;
  helper?: string;
  margin?: InputMargin;
};

interface InputControlProps extends ControlExtraProps {
  inputRef?: Ref<HTMLElement | undefined>;
  classes?: InputControlClasses;
  children: ReactNode;
}

const marginClasses: Record<InputMargin, string> = {
  none: '',
  xs: cls.xsMargin,
  sm: cls.smMargin,
  md: cls.mdMargin,
};

export const InputControl: FC<InputControlProps> = ({
  label,
  inputRef,
  required,
  error,
  helper,
  margin = 'md',
  classes,
  children,
}) => {
  const hasErrorText = !!(typeof error === 'string' && error);

  const focusInput = () => inputRef && 'current' in inputRef && inputRef.current?.focus();

  return (
    <div className={classNames(marginClasses[margin], classes?.container)}>
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
