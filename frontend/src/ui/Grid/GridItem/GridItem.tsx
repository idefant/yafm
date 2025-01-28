import classNames from 'classnames';
import { FC, HTMLAttributes } from 'react';

import { BreakpointValues, useBreakpointValue } from '#hooks/useBreakpointValue';

import cls from './GridItem.module.scss';
import { ColumnCount } from './gridItemType';

interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  size: BreakpointValues<ColumnCount> | ColumnCount;
}

export const GridItem: FC<GridItemProps> = ({ size, className, ...props }) => {
  const value = useBreakpointValue<ColumnCount>(size);

  return <div className={classNames(cls.GridItem, cls[`size${value}`], className)} {...props} />;
};
