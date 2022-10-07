import classNames from 'classnames';
import { FC } from 'react';

import CardBody from './CardBody';
import CardFooter from './CardFooter';
import CardHeader from './CardHeader';

interface CardExtensions {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
}

const Card: FC<React.HTMLAttributes<HTMLDivElement>> & CardExtensions = ({
  children,
  className,
  ...props
}) => (
  <div className={classNames('bg-slate-900 shadow-lg rounded-lg mb-6 border border-slate-100/30', className)} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
