import classNames from 'classnames';
import { FC } from 'react';

const EntranceTitle: FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h1
    className={classNames('text-3xl font-bold text-center mb-7', className)}
    {...props}
  >
    {children}
  </h1>
);

export default EntranceTitle;
