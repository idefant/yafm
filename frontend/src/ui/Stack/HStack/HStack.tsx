import { FC } from 'react';
import { Except } from 'type-fest';

import { Flex, FlexProps } from '../Flex';

interface HStackProps extends Except<FlexProps, 'direction'> {}

export const HStack: FC<HStackProps> = (props) => <Flex direction="row" gap={8} {...props} />;
