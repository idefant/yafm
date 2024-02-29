import classNames from 'classnames';
import { ButtonHTMLAttributes, FC } from 'react';

import { buttonColors, TButtonColor } from './buttonColors';

interface ButtonProps {
  color?: TButtonColor;
  className?: string;
}

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps> = ({
  color,
  className,
  ...props
}) => (
  <button
    className={classNames(
      color && buttonColors[color],
      'btn',
      className,
      props.disabled && 'opacity-60',
    )}
    type="button"
    {...props}
  />
);

export default Button;
