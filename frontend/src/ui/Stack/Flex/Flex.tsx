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
  start: cls.alignStart,
  center: cls.alignCenter,
  end: cls.alignEnd,
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
  fullWidth?: boolean;
  gap?: FlexGap;
}

export const Flex: FC<FlexProps> = ({
  direction = 'row',
  justify = 'start',
  align = 'start',
  wrap = 'nowrap',
  fullWidth,
  gap,
  className,
  ...props
}) => (
  <div
    className={classNames(
      cls.Flex,
      directionClasses[direction],
      justifyClasses[justify],
      alignClasses[align],
      wrapClasses[wrap],
      { [cls.fullWidth]: fullWidth },
      className,
    )}
    style={{ gap }}
    {...props}
  />
);
