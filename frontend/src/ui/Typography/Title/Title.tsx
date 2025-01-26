import classNames from 'classnames';
import { ElementType, FC, HTMLAttributes } from 'react';

import cls from './Title.module.scss';
import { TitleLevel } from './titleType';

interface TitleProps extends HTMLAttributes<HTMLDivElement> {
  level: TitleLevel;
  as?: ElementType;
}

export const Title: FC<TitleProps> = ({ level, as: Component = 'div', ...props }) => (
  <Component className={classNames(cls.Title, cls[`level${level}`])} {...props} />
);
