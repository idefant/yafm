import { FC, ReactNode } from 'react';
import ReactTooltip from 'react-tooltip';

import Icon from '../Icon';

interface TableTooltipProps {
  id: string;
  children?: ReactNode;
}

const TableTooltip: FC<TableTooltipProps> = ({ id, children }) => {
  if (!children) return null;

  return (
    <>
      <div data-tip data-for={id} className="px-3">
        <Icon.Info className="w-7 h-7" />
      </div>
      <ReactTooltip
        id={id}
        effect="solid"
        className="max-w-sm"
      >
        {children}
      </ReactTooltip>
    </>
  );
};

export default TableTooltip;
