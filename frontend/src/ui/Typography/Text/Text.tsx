import classNames from 'classnames';
import { ElementType, HTMLAttributes } from 'react';

import cls from './Text.module.scss';
import { TextAlign, TextColor, TextSize } from './textType';

const alignClasses: Record<TextAlign, string> = {
  left: cls.alignLeft,
  center: cls.alignCenter,
  right: cls.alignRight,
};

interface TextProps<TIsBlock extends boolean>
  extends HTMLAttributes<TIsBlock extends true ? HTMLDivElement : HTMLSpanElement> {
  color?: TextColor;
  size?: TextSize;
  align?: TextAlign;
  bold?: boolean;
  block?: TIsBlock;
}

export const Text = <TIsBlock extends boolean = false>({
  color = 'primary',
  size = 'md',
  align = 'left',
  bold = false,
  block,
  className,
  ...props
}: TextProps<TIsBlock>) => {
  const Component: ElementType = block ? 'div' : 'span';

  return (
    <Component
      className={classNames(cls.Text, cls[color], cls[size], alignClasses[align], className, {
        [cls.bold]: bold,
      })}
      {...props}
    />
  );
};
