import classNames from 'classnames';
import { FC, HTMLAttributes } from 'react';

import { CardActions } from '../CardActions/CardActions';
import { CardContent } from '../CardContent';

import cls from './Card.module.scss';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}
interface CardExtensions {
  Content: typeof CardContent;
  Actions: typeof CardActions;
}

export const Card: FC<CardProps> & CardExtensions = ({ className, ...props }) => (
  <div className={classNames(cls.Card, className)} {...props} />
);

Card.Content = CardContent;
Card.Actions = CardActions;
