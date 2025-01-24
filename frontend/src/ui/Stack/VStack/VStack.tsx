import { FC } from 'react';
import { Except } from 'type-fest';

import { Flex, FlexProps } from '../Flex';

interface VStackProps extends Except<FlexProps, 'direction'> {}

export const VStack: FC<VStackProps> = (props) => <Flex direction="column" gap={8} {...props} />;
