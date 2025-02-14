import classNames from 'classnames';
import { FC } from 'react';
import { Except } from 'type-fest';

import { VStack, VStackProps } from '#ui/Stack';
import { Text } from '#ui/Typography';

import cls from './Alert.module.scss';
import { AlertColor } from './alertType';

interface AlertProps extends Except<VStackProps, 'children'> {
  title?: string;
  text?: string;
  color?: AlertColor;
}

export const Alert: FC<AlertProps> = ({ title, text, color = 'danger', className, ...props }) => {
  if (!title && !text) return null;

  return (
    <VStack gap={8} className={classNames(cls.Alert, cls[color], className)} {...props}>
      {title && (
        <Text size="xl" block>
          {title}
        </Text>
      )}
      {text && <Text block>{text}</Text>}
    </VStack>
  );
};
