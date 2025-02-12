import BigNumber from 'bignumber.js';
import { FC } from 'react';

import { HStack, VStack } from '#ui/Stack';
import { Text, TextColor, TextSize, TextWeight } from '#ui/Typography';

export interface SumValueProps {
  value: BigNumber;
  decimalPlacesNumber: number;
  currencyCode: string;
  description?: string;
  color?: TextColor;
  size?: TextSize;
  weight?: TextWeight;
}

export const SumValue: FC<SumValueProps> = ({
  value,
  decimalPlacesNumber,
  currencyCode,
  description,
  color,
  size,
  weight,
}) => {
  const formattedValue = value.toFormat(decimalPlacesNumber);

  const sumColor: TextColor =
    color ||
    (() => {
      if (value.isGreaterThan(0)) return 'success';
      if (value.isLessThan(0)) return 'danger';
      return 'secondary';
    })();

  return (
    <VStack gap={0} align="end">
      <HStack>
        <Text color={sumColor} size={size} weight={weight}>
          {formattedValue}
        </Text>
        <Text color={sumColor} size={size} weight={weight}>
          {currencyCode}
        </Text>
      </HStack>
      {description && (
        <Text color="secondary" size="sm">
          {description}
        </Text>
      )}
    </VStack>
  );
};
