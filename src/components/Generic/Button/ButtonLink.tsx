import classNames from 'classnames';
import { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { buttonColors, TButtonColor } from '.';

interface ButtonLinkProps {
  color?: TButtonColor;
  className?: string;
  to: string;
  children?: ReactNode;
}

const ButtonLink: FC<ButtonLinkProps> = ({
  children,
  color,
  className,
  to,
}) => (
  <Link
    to={to}
    className={classNames(
      color && buttonColors[color],
      'px-4 py-2 rounded-lg border border-gray-600 border-2 inline-block',
      className,
    )}
  >
    {children}
  </Link>
);

export default ButtonLink;
