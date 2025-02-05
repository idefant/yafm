import classNames from 'classnames';
import { ReactNode } from 'react';

import { ButtonBase, ButtonBaseProps } from '#ui/ButtonBase';

import cls from './Button.module.scss';
import { ButtonSize } from './buttonType';

type ButtonProps<T extends string | undefined = undefined> = ButtonBaseProps<T> & {
  /** Размер кнопки */
  size?: ButtonSize;
  /** Иконка перед текстом */
  startIcon?: ReactNode;
  /** Иконка после текстом */
  endIcon?: ReactNode;
};

export const Button = <T extends string | undefined = undefined>({
  size = 'md',
  className,
  startIcon,
  endIcon,
  children,
  ...props
}: ButtonProps<T>) => (
  <ButtonBase className={classNames(cls.Button, cls[size], className)} {...(props as any)}>
    {startIcon && <span className={classNames(cls.icon, cls.startIcon)}>{startIcon}</span>}
    {children}
    {endIcon && <span className={classNames(cls.icon, cls.endIcon)}>{endIcon}</span>}
  </ButtonBase>
);
