import classNames from 'classnames';
import React, { FC, ReactNode } from 'react';

const Table: FC<React.TableHTMLAttributes<HTMLTableElement>> = ({
  className,
  ...props
}) => (
  <table
    className={classNames('border-2 border-gray-700', className)}
    {...props}
  />
);

export const THead: FC<{ children?: ReactNode }> = ({ children }) => <thead>{children}</thead>;

export const TBody: FC<{ children?: ReactNode }> = ({ children }) => <tbody>{children}</tbody>;
export const TR: FC<{
  className?: string;
  hide?: boolean;
  children?: ReactNode;
}> = ({ children, className, hide }) => (
  <tr
    className={classNames(
      'border-b-2 border-gray-700',
      hide && 'opacity-60',
      className,
    )}
  >
    {children}
  </tr>
);

export const TH: FC<{
  colSpan?: number;
  className?: string;
  children?: ReactNode;
}> = ({ children, colSpan, className }) => (
  <th
    className={classNames('bg-gray-200 px-4 py-3', className)}
    colSpan={colSpan}
  >
    {children}
  </th>
);

export const TD: FC<{
  colSpan?: number;
  className?: string;
  children?: ReactNode;
}> = ({ children, colSpan, className }) => (
  <td
    className={classNames('bg-gray-100 px-4 py-3', className)}
    colSpan={colSpan}
  >
    {children}
  </td>
);

export const TDIcon: FC<{ children?: ReactNode }> = ({ children }) => (
  <td className="bg-gray-100">{children}</td>
);

export default Table;
