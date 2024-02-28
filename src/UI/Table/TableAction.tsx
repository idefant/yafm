import { FC } from 'react';

interface TableActionProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const TableAction: FC<TableActionProps> = ({ onClick, icon: Icon }) => (
  <button className="p-2" onClick={onClick} type="button" aria-label="table action">
    <Icon className="w-7 h-7" />
  </button>
);

export default TableAction;
