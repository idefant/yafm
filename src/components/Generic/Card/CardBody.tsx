import classNames from 'classnames';
import { FC } from 'react';

const CardBody: FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={classNames('py-3 px-5', className)} {...props}>
    {children}
  </div>
);

export default CardBody;
