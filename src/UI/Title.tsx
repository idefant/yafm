import classNames from 'classnames';
import { FC } from 'react';

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
}

export const Title: FC<TitleProps> = ({ tag: Tag = 'h1', className, ...props }) => (
  <Tag className={classNames('text-3xl font-bold mb-4 mx-4', className)} {...props} />
);
