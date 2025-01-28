import classNames from 'classnames';
import { ComponentProps, ElementType, FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { ButtonColor, ButtonSize, ButtonVariant } from '../Button';
import cls from '../Button/Button.module.scss';

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  /** Цвет кнопки */
  color?: ButtonColor;
  /** Стиль кнопки */
  variant?: ButtonVariant;
  /** Размер кнопки */
  size?: ButtonSize;
  /** Блокировка кнопки */
  disabled?: boolean;
  /** Икона перед текстом */
  startIcon?: ReactNode;
  /** Икона после текстом */
  endIcon?: ReactNode;
}

export const ButtonLink: FC<ButtonLinkProps> = ({
  color = 'primary',
  size = 'md',
  variant = 'contained',
  className,
  startIcon,
  endIcon,
  children,
  ...props
}) => {
  const Component: ElementType =
    typeof props.to === 'string' &&
    (props.to.startsWith('http://') || props.to.startsWith('https://'))
      ? 'a'
      : Link;

  return (
    <Component
      className={classNames(cls.Button, cls[color], cls[variant], cls[size], {
        [cls.disabled]: props.disabled,
      })}
      type="button"
      role="button"
      href={props.to.toString()}
      {...props}
    >
      {startIcon && <span className={classNames(cls.icon, cls.startIcon)}>{startIcon}</span>}
      {children}
      {endIcon && <span className={classNames(cls.icon, cls.endIcon)}>{endIcon}</span>}
    </Component>
  );
};
