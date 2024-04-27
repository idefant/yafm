import { FC, ReactNode, useId } from 'react';
import ReactTooltip from 'react-tooltip';

import Icon from '#ui/Icon';

interface TableTooltipProps {
  children?: ReactNode;
}

const TableTooltip: FC<TableTooltipProps> = ({ children }) => {
  const id = useId();
  if (!children) return null;

  return (
    <>
      <div data-tip data-for={id} className="px-3">
        <Icon.Info className="w-7 h-7" />
      </div>
      <ReactTooltip id={id} effect="solid" className="max-w-sm">
        {children}
      </ReactTooltip>
    </>
  );
};

export default TableTooltip;
