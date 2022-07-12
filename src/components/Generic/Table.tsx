import classNames from "classnames";
import { FC, ReactNode } from "react";

const Table: FC<React.TableHTMLAttributes<HTMLTableElement>> = ({
  className,
  ...props
}) => {
  return (
    <table
      className={classNames("border-2 border-gray-700", className)}
      {...props}
    ></table>
  );
};

export const THead: FC<{ children?: ReactNode }> = ({ children }) => {
  return <thead>{children}</thead>;
};

export const TBody: FC<{ children?: ReactNode }> = ({ children }) => {
  return <tbody>{children}</tbody>;
};

export const TR: FC<{
  className?: string;
  hide?: boolean;
  children?: ReactNode;
}> = ({ children, className, hide }) => {
  return (
    <tr
      className={classNames(
        "border-b-2 border-gray-700",
        hide && "opacity-60",
        className
      )}
    >
      {children}
    </tr>
  );
};

export const TH: FC<{
  colSpan?: number;
  className?: string;
  children?: ReactNode;
}> = ({ children, colSpan, className }) => {
  return (
    <th
      className={classNames("bg-gray-200 px-4 py-3", className)}
      colSpan={colSpan}
    >
      {children}
    </th>
  );
};

export const TD: FC<{
  colSpan?: number;
  className?: string;
  children?: ReactNode;
}> = ({ children, colSpan, className }) => {
  return (
    <td
      className={classNames("bg-gray-100 px-4 py-3", className)}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};

export const TDIcon: FC<{ children?: ReactNode }> = ({ children }) => {
  return <td className="bg-gray-100">{children}</td>;
};

export default Table;
