import classNames from 'classnames';
import { FC } from 'react';

const CardFooter: FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={classNames('py-3 px-5 border-t-2 border-t-gray-500', className)} {...props}>
    {children}
  </div>
);

export default CardFooter;
