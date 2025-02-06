import classNames from 'classnames';
import { InputHTMLAttributes, forwardRef } from 'react';

import { InputMargin } from '#types/inputType';

import cls from './Checkbox.module.scss';
import { CheckboxClasses } from './checkboxType';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean;
  margin?: InputMargin;
  classes?: CheckboxClasses;
}

const marginClasses: Record<InputMargin, string> = {
  none: '',
  xs: cls.xsMargin,
  sm: cls.smMargin,
  md: cls.mdMargin,
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ error, margin = 'xs', classes, children, ...props }, ref) => {
    const hasError = typeof error === 'string' || !!error;

    return (
      <label
        className={classNames(cls.Checkbox, classes?.container, marginClasses[margin], {
          [cls.disabled]: props.disabled,
          [cls.hasError]: !props.disabled && hasError,
        })}
      >
        <input
          className={classNames(cls.input, classes?.input)}
          type="checkbox"
          ref={ref}
          {...props}
        />
        <div className={classNames(cls.box, classes?.box)} />
        {children && <span className={classNames(cls.text, classes?.text)}>{children}</span>}
      </label>
    );
  },
);
