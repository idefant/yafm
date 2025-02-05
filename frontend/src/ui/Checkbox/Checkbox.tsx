import classNames from 'classnames';
import { InputHTMLAttributes, forwardRef } from 'react';

import cls from './Checkbox.module.scss';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ error, children, ...props }, ref) => {
    const hasError = typeof error === 'string' || !!error;

    return (
      <label
        className={classNames(cls.Checkbox, {
          [cls.disabled]: props.disabled,
          [cls.hasError]: !props.disabled && hasError,
        })}
      >
        <input className={cls.input} type="checkbox" ref={ref} {...props} />
        <div className={cls.box} />
        {children && <span className={cls.text}>{children}</span>}
      </label>
    );
  },
);
