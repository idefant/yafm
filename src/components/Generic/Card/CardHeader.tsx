import classNames from 'classnames';
import { FC } from 'react';

const CardHeader: FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={classNames('text-xl font-bold py-3 px-5 border-b-2 border-b-gray-500', className)} {...props}>
    {children}
  </div>
);

export default CardHeader;
