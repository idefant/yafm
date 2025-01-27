import classNames from 'classnames';
import { FC, HTMLAttributes } from 'react';

import { TextAlign, TextColor, TextSize } from '../Text';

import cls from './Paragraph.module.scss';

const alignClasses: Record<TextAlign, string> = {
  left: cls.alignLeft,
  center: cls.alignCenter,
  right: cls.alignRight,
};

interface ParagraphProps extends HTMLAttributes<HTMLSpanElement> {
  color?: TextColor;
  size?: TextSize;
  align?: TextAlign;
  bold?: boolean;
  gutterBottom?: boolean;
}

export const Paragraph: FC<ParagraphProps> = ({
  color = 'primary',
  size = 'md',
  align = 'left',
  bold,
  gutterBottom,
  className,
  ...props
}) => (
  <p
    className={classNames(cls.Paragraph, cls[color], cls[size], alignClasses[align], className, {
      [cls.bold]: bold,
      [cls.gutterBottom]: gutterBottom,
    })}
    {...props}
  />
);
