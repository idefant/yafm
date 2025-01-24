import classNames from 'classnames';
import { ButtonHTMLAttributes, FC } from 'react';

import cls from './Button.module.scss';
import { ButtonLink } from './ButtonLink';
import { ButtonColor, ButtonSize, ButtonVariant } from './buttonType';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Цвет кнопки */
  color?: ButtonColor;
  /** Стиль кнопки */
  variant?: ButtonVariant;
  /** Размер кнопки */
  size?: ButtonSize;
}

export const Button: FC<ButtonProps> & { Link: typeof ButtonLink } = ({
  color = 'primary',
  size = 'md',
  variant = 'contained',
  className,
  ...props
}) => (
  <button
    className={classNames(cls.Button, cls[color], cls[variant], cls[size], {
      [cls.disabled]: props.disabled,
    })}
    type="button"
    {...props}
  />
);

Button.Link = ButtonLink;
