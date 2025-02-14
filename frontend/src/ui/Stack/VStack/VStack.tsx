import { FC } from 'react';
import { Except } from 'type-fest';

import { Flex, FlexProps } from '../Flex';

export interface VStackProps extends Except<FlexProps, 'direction'> {}

export const VStack: FC<VStackProps> = ({ gap = 8, ...props }) => (
  <Flex direction="column" align="stretch" gap={gap} {...props} />
);
