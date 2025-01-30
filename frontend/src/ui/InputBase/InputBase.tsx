import classNames from 'classnames';
import { forwardRef, InputHTMLAttributes, ReactNode, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { Except } from 'type-fest';

import cls from './InputBase.module.scss';
import { InputBaseClasses, InputBaseSize } from './inputBaseType';

interface InputBaseProps
  extends Except<InputHTMLAttributes<HTMLInputElement>, 'size' | 'className' | 'prefix'> {
  size?: InputBaseSize;
  error?: string | boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  classes?: InputBaseClasses;
}

export const InputBase = forwardRef<HTMLInputElement, InputBaseProps>(
  ({ size = 'md', error, prefix, suffix, classes, ...props }, ref) => {
    const localRef = useRef<HTMLInputElement>();

    const hasError = typeof error === 'string' || !!error;

    const focusInput = () => localRef.current?.focus();

    return (
      <div
        className={classNames(cls.InputBase, cls[size], classes?.container, {
          [cls.hasError]: hasError,
        })}
        onClick={focusInput}
      >
        {prefix && <div className={classNames(cls.prefix, classes?.prefix)}>{prefix}</div>}
        <input
          className={classNames(cls.input, classes?.input)}
          ref={mergeRefs([ref, localRef])}
          {...props}
        />
        {suffix && <div className={classNames(cls.suffix, classes?.suffix)}>{suffix}</div>}
      </div>
    );
  },
);
