import classNames from 'classnames';
import { ButtonHTMLAttributes, FC } from 'react';

import { buttonColors, TButtonColor } from '.';

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
      'px-4 py-2 rounded-lg border border-gray-600 border-2',
      className,
      props.disabled && 'opacity-60',
    )}
    type="button"
    {...props}
  />
);

export default Button;
