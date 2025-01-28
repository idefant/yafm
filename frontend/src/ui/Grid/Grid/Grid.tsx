import classNames from 'classnames';
import { CSSProperties, FC, HTMLAttributes } from 'react';

import { GridItem } from '../GridItem';

import cls from './Grid.module.scss';
import { GridGap } from './gridGap';

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  gap?: GridGap;
  rowGap?: GridGap;
  columnGap?: GridGap;
  reversed?: boolean;
}

interface GridExtensions {
  Item: typeof GridItem;
}

export const Grid: FC<GridProps> & GridExtensions = ({
  gap = 0,
  rowGap,
  columnGap,
  reversed,
  className,
  ...props
}) => (
  <div
    className={classNames(cls.Grid, className, { [cls.reversed]: reversed })}
    style={
      {
        '--grid-row-gap': `${rowGap || gap}px`,
        '--grid-column-gap': `${columnGap || gap}px`,
      } as CSSProperties
    }
    {...props}
  />
);

Grid.Item = GridItem;
