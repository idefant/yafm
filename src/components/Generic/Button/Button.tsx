import classNames from 'classnames';
import { ButtonHTMLAttributes, FC } from 'react';

import { TButtonColor } from '.';

interface ButtonProps {
  color?: TButtonColor;
  className?: string;
}

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps> = ({
  color = 'white',
  className,
  ...props
}) => (
  <button
    className={classNames(
      color === 'green' && 'bg-green-500',
      color === 'gray' && 'bg-gray-400',
      color === 'red' && 'bg-red-600',
      'px-4 py-2 rounded-lg border border-gray-600 border-2',
      className,
    )}
    type="button"
    {...props}
  />
);

export default Button;
