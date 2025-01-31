import { FC } from 'react';
import { Except } from 'type-fest';

import { Flex, FlexProps } from '../Flex';

export interface HStackProps extends Except<FlexProps, 'direction'> {}

export const HStack: FC<HStackProps> = ({ gap = 8, ...props }) => (
  <Flex direction="row" align="start" gap={gap} {...props} />
);
