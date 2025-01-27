import classNames from 'classnames';
import { FC, HTMLAttributes } from 'react';

import cls from './CardContent.module.scss';

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent: FC<CardContentProps> = ({ className, ...props }) => (
  <div className={classNames(cls.CardContent, className)} {...props} />
);

CardContent.displayName = 'Card.Content';
