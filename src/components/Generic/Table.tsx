import classNames from "classnames";
import { FC } from "react";

const Table: FC = ({ children }) => {
  return <table className="border-2 border-gray-700">{children}</table>;
};

export const THead: FC = ({ children }) => {
  return <thead>{children}</thead>;
};

export const TBody: FC = ({ children }) => {
  return <tbody>{children}</tbody>;
};

export const TR: FC<{ className?: string; hide?: boolean }> = ({
  children,
  className,
  hide,
}) => {
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

export const TH: FC<{ colSpan?: number; className?: string }> = ({
  children,
  colSpan,
  className,
}) => {
  return (
    <th
      className={classNames("bg-gray-200 px-4 py-3", className)}
      colSpan={colSpan}
    >
      {children}
    </th>
  );
};

export const TD: FC<{ colSpan?: number; className?: string }> = ({
  children,
  colSpan,
  className,
}) => {
  return (
    <td
      className={classNames("bg-gray-100 px-4 py-3", className)}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};

export const TDIcon: FC = ({ children }) => {
  return <td className="bg-gray-100">{children}</td>;
};

export default Table;
