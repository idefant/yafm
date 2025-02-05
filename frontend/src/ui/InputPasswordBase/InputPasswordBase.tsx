import classNames from 'classnames';
import { forwardRef } from 'react';
import { Except } from 'type-fest';
import { useBoolean } from 'usehooks-ts';

import EyeOffIcon from '#svg/eye-off.svg?react';
import EyeIcon from '#svg/eye.svg?react';
import { InputBase, InputBaseProps } from '#ui/InputBase';

import cls from './InputPasswordBase.module.scss';

export interface InputPasswordBaseProps extends Except<InputBaseProps, 'suffix'> {}

export const InputPasswordBase = forwardRef<HTMLInputElement, InputPasswordBaseProps>(
  ({ size = 'md', ...props }, ref) => {
    const isVisiblePassword = useBoolean();

    const params = isVisiblePassword.value
      ? { type: 'text', label: 'Hide', Icon: EyeOffIcon }
      : { type: 'password', label: 'Show', Icon: EyeIcon };

    return (
      <InputBase
        type={params.type}
        size={size}
        suffix={
          <button
            type="button"
            onClick={isVisiblePassword.toggle}
            className={classNames(cls.button, cls[size], { [cls.disabled]: props.disabled })}
            aria-label={params.label}
          >
            <params.Icon className={cls.icon} />
          </button>
        }
        ref={ref}
        {...props}
      />
    );
  },
);
