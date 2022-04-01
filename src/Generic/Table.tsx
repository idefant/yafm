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

export const TR: FC = ({ children }) => {
  return <tr className="border-b-2 border-gray-700">{children}</tr>;
};

export const TH: FC = ({ children }) => {
  return <th className="bg-gray-200 px-4 py-3">{children}</th>;
};

export const TD: FC = ({ children }) => {
  return <td className="bg-gray-100 px-4 py-3">{children}</td>;
};

export const TDIcon: FC = ({ children }) => {
  return <td className="bg-gray-100">{children}</td>;
};

export default Table;
