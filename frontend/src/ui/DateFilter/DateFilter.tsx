import { FC } from 'react';

import ChevronLeftIcon from '#svg/chevron-left.svg?react';
import ChevronRightIcon from '#svg/chevron-right.svg?react';
import { IconButton } from '#ui/IconButton';
import { Select } from '#ui/Select';
import { HStack, VStack } from '#ui/Stack';

import { DateFilterReturn } from './useDateFilter';

interface DateFilterProps {
  options: DateFilterReturn;
}

export const DateFilter: FC<DateFilterProps> = ({ options }) => {
  const { period, setDate, setUnit } = options;

  const periodOptions = [
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ];

  return (
    <VStack gap={4}>
      <Select
        label="Period type"
        options={periodOptions}
        value={periodOptions.find((option) => option.value === period.unit)}
        onChange={(newValue: any) => setUnit(newValue?.value)}
        margin="sm"
      />

      <HStack align="center">
        <IconButton
          variant="outlined"
          color="secondary"
          icon={ChevronLeftIcon}
          onClick={() => setDate(period.startedAt.subtract(1, period.unit))}
        />
        <div>
          {period.unit === 'month' && `${period.startedAt.format('MMM YYYY')}`}
          {period.unit === 'year' && period.startedAt.year()}
        </div>
        <IconButton
          variant="outlined"
          color="secondary"
          icon={ChevronRightIcon}
          onClick={() => setDate(period.startedAt.add(1, period.unit))}
        />
      </HStack>
    </VStack>
  );
};
