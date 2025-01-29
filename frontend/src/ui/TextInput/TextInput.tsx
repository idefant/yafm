import classNames from 'classnames';
import { InputHTMLAttributes, ReactNode, forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { Except } from 'type-fest';

import { Text } from '#ui/Typography';

import cls from './TextInput.module.scss';

type TextInputElements = 'container' | 'label' | 'labelText' | 'inputWrapper' | 'input' | 'error';

interface TextInputProps
  extends Except<InputHTMLAttributes<HTMLInputElement>, 'size' | 'className' | 'prefix'> {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  error?: string | boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  classes?: Record<TextInputElements, string>;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, size = 'md', error, prefix, suffix, classes, ...props }, ref) => {
    const localRef = useRef<HTMLInputElement>();

    const hasError = typeof error === 'string' || !!error;

    const focusInput = () => localRef.current?.focus();

    return (
      <div
        className={classNames(cls.TextInput, cls[size], classes?.container, {
          [cls.hasError]: hasError,
          [cls.required]: props.required,
          [cls.hasPrefix]: !!prefix,
          [cls.hasSuffix]: !!suffix,
          [cls.disabled]: props.disabled,
        })}
      >
        {label && (
          <label className={classNames(cls.label, classes?.label)}>
            <span
              title={label}
              className={classNames(cls.labelText, classes?.labelText)}
              onClick={focusInput}
            >
              {label}
            </span>
          </label>
        )}
        <div className={classNames(cls.inputWrapper, classes?.inputWrapper)} onClick={focusInput}>
          {prefix && <div className={cls.prefix}>{prefix}</div>}
          <input
            className={classNames(cls.input, classes?.input)}
            ref={mergeRefs([ref, localRef])}
            {...props}
          />
          {suffix && <div className={cls.suffix}>{suffix}</div>}
        </div>
        {typeof error === 'string' && error && (
          <Text
            block
            color="danger"
            title={error}
            className={classNames(cls.error, classes?.error)}
          >
            {error}
          </Text>
        )}
      </div>
    );
  },
);
