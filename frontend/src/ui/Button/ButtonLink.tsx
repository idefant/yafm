import classNames from 'classnames';
import { ComponentProps, ElementType, FC } from 'react';
import { Link } from 'react-router-dom';

import cls from './Button.module.scss';
import { ButtonColor, ButtonSize, ButtonVariant } from './buttonType';

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  /** Цвет кнопки */
  color?: ButtonColor;
  /** Стиль кнопки */
  variant?: ButtonVariant;
  /** Размер кнопки */
  size?: ButtonSize;
  /** Блокировка кнопки */
  disabled?: boolean;
}

export const ButtonLink: FC<ButtonLinkProps> = ({
  color = 'primary',
  size = 'md',
  variant = 'contained',
  className,
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
    />
  );
};
