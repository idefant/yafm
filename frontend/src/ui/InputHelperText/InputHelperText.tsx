import classNames from 'classnames';
import { FC } from 'react';
import { Except } from 'type-fest';

import { Text, TextProps } from '#ui/Typography';

import cls from './InputHelperText.module.scss';

interface InputHelperTextProps extends Except<TextProps<true>, 'children'> {
  isError?: boolean;
  children: string;
}

export const InputHelperText: FC<InputHelperTextProps> = ({
  isError,
  children,
  className,
  ...props
}) => (
  <Text
    block
    color={isError ? 'danger' : 'secondary'}
    title={children}
    className={classNames(cls.InputHelperText, className)}
    {...props}
  >
    {children}
  </Text>
);
