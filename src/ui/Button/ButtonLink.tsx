import classNames from 'classnames';
import { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { buttonColors, ButtonColor } from './buttonColors';

interface ButtonLinkProps {
  color?: ButtonColor;
  className?: string;
  to: string;
  children?: ReactNode;
}

const ButtonLink: FC<ButtonLinkProps> = ({ children, color, className, to }) => (
  <Link to={to} className={classNames(color && buttonColors[color], 'btn', className)}>
    {children}
  </Link>
);

export default ButtonLink;
