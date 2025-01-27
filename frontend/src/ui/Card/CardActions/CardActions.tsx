import classNames from 'classnames';
import { FC, HTMLAttributes } from 'react';

import { HStack } from '#ui/Stack';

import cls from './CardActions.module.scss';

interface CardActionsProps extends HTMLAttributes<HTMLDivElement> {}

export const CardActions: FC<CardActionsProps> = ({ className, ...props }) => (
  <HStack className={classNames(cls.CardActions, className)} {...props} />
);

CardActions.displayName = 'Card.Actions';
