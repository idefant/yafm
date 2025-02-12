import classNames from 'classnames';
import { ElementType, HTMLAttributes } from 'react';

import cls from './Text.module.scss';
import { TextAlign, TextColor, TextSize, TextWeight } from './textType';

const alignClasses: Record<TextAlign, string> = {
  left: cls.alignLeft,
  center: cls.alignCenter,
  right: cls.alignRight,
};

export interface TextProps<TIsBlock extends boolean>
  extends HTMLAttributes<TIsBlock extends true ? HTMLDivElement : HTMLSpanElement> {
  color?: TextColor;
  size?: TextSize;
  weight?: TextWeight;
  align?: TextAlign;
  bold?: boolean;
  block?: TIsBlock;
}

export const Text = <TIsBlock extends boolean = false>({
  color = 'primary',
  size = 'md',
  weight = 'regular',
  align = 'left',
  block,
  className,
  ...props
}: TextProps<TIsBlock>) => {
  const Component: ElementType = block ? 'div' : 'span';

  return (
    <Component
      className={classNames(
        cls.Text,
        cls[color],
        cls[size],
        cls[weight],
        alignClasses[align],
        className,
      )}
      {...props}
    />
  );
};
