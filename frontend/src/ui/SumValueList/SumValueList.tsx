import BigNumber from 'bignumber.js';
import { FC, useMemo } from 'react';

import { VStack } from '#ui/Stack';
import { SumValue, SumValueProps } from '#ui/SumValue';

interface SumValueListProps {
  items: SumValueProps[];
}

export const SumValueList: FC<SumValueListProps> = ({ items }) => {
  const sortedItems = useMemo(
    () => items.sort((a, b) => BigNumber(b.value).minus(a.value).toNumber()),
    [items],
  );

  return (
    <VStack>
      {sortedItems.map((item, i) => (
        <SumValue {...item} key={i} />
      ))}
    </VStack>
  );
};
