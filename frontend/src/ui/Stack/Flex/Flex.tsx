import classNames from 'classnames';
import { FC, HTMLAttributes } from 'react';

import cls from './Flex.module.scss';
import { FlexAlign, FlexDirection, FlexGap, FlexJustify, FlexWrap } from './flexType';

const directionClasses: Record<FlexDirection, string> = {
  row: cls.directionRow,
  column: cls.directionColumn,
};

const justifyClasses: Record<FlexJustify, string> = {
  start: cls.justifyStart,
  center: cls.justifyCenter,
  end: cls.justifyEnd,
  spaceBetween: cls.justifySpaceBetween,
  spaceAround: cls.justifySpaceAround,
  spaceEvenly: cls.justifySpaceEvenly,
};

const alignClasses: Record<FlexAlign, string> = {
  normal: cls.alignNormal,
  stretch: cls.alignStretch,
  start: cls.alignStart,
  center: cls.alignCenter,
  end: cls.alignEnd,
  baseline: cls.alignBaseline,
};

const wrapClasses: Record<FlexWrap, string> = {
  wrap: cls.wrap,
  nowrap: cls.nowrap,
};

export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  direction?: FlexDirection;
  justify?: FlexJustify;
  align?: FlexAlign;
  wrap?: FlexWrap;
  gap?: FlexGap;
}

export const Flex: FC<FlexProps> = ({
  direction = 'row',
  justify = 'start',
  align = 'normal',
  wrap = 'nowrap',
  gap,
  className,
  style,
  ...props
}) => (
  <div
    className={classNames(
      cls.Flex,
      directionClasses[direction],
      justifyClasses[justify],
      alignClasses[align],
      wrapClasses[wrap],
      className,
    )}
    style={{ gap, ...style }}
    {...props}
  />
);
