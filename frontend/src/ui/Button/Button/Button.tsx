import classNames from 'classnames';
import { ButtonHTMLAttributes, FC, ReactNode } from 'react';

import { ButtonLink } from '../ButtonLink';

import cls from './Button.module.scss';
import { ButtonColor, ButtonSize, ButtonVariant } from './buttonType';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Цвет кнопки */
  color?: ButtonColor;
  /** Стиль кнопки */
  variant?: ButtonVariant;
  /** Размер кнопки */
  size?: ButtonSize;
  /** Икона перед текстом */
  startIcon?: ReactNode;
  /** Икона после текстом */
  endIcon?: ReactNode;
}

export const Button: FC<ButtonProps> & { Link: typeof ButtonLink } = ({
  color = 'primary',
  size = 'md',
  variant = 'contained',
  className,
  startIcon,
  endIcon,
  children,
  ...props
}) => (
  <button
    className={classNames(cls.Button, cls[color], cls[variant], cls[size], {
      [cls.disabled]: props.disabled,
    })}
    type="button"
    {...props}
  >
    {startIcon && <span className={classNames(cls.icon, cls.startIcon)}>{startIcon}</span>}
    {children}
    {endIcon && <span className={classNames(cls.icon, cls.endIcon)}>{endIcon}</span>}
  </button>
);

Button.Link = ButtonLink;
