import classNames from 'classnames';
import { ButtonHTMLAttributes, ComponentProps, ElementType } from 'react';
import { Link } from 'react-router-dom';

import { LinkBase } from '#ui/LinkBase';

import cls from './ButtonBase.module.scss';
import { ButtonColor, ButtonVariant } from './buttonBaseType';

export type ButtonBaseProps<T extends string | undefined = undefined> = (T extends undefined
  ? ButtonHTMLAttributes<HTMLButtonElement>
  : ComponentProps<typeof Link> & { to: T }) & {
  /** Цвет кнопки */
  color?: ButtonColor;
  /** Стиль кнопки */
  variant?: ButtonVariant;
  /** Блокировка кнопки */
  disabled?: boolean;
};

export const ButtonBase = <T extends string | undefined = undefined>({
  color = 'primary',
  variant = 'contained',
  className,
  children,
  ...props
}: ButtonBaseProps<T>) => {
  const Component: ElementType = 'to' in props ? LinkBase : 'button';

  return (
    <Component
      className={classNames(cls.ButtonBase, cls[color], cls[variant], className, {
        [cls.disabled]: props.disabled,
      })}
      type="button"
      {...(props as any)}
    >
      {children}
    </Component>
  );
};
