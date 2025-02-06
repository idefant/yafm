import { FC } from 'react';

import ChevronLeftIcon from '#svg/chevron-left.svg?react';
import ChevronRightIcon from '#svg/chevron-right.svg?react';
import { IconButton } from '#ui/IconButton';
import { Select } from '#ui/Select';
import { HStack } from '#ui/Stack';

import { DateFilterResult } from './useDateFilter';

interface DateFilterProps {
  options: DateFilterResult;
}

const DateFilter: FC<DateFilterProps> = ({ options }) => {
  const { date, periodType, setDate, setPeriodType } = options;

  const periodOptions = [
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ];

  return (
    <div className="flex gap-3 items-center">
      <Select
        label="Period type"
        options={periodOptions}
        value={periodOptions.find((option) => option.value === periodType)}
        onChange={(newValue: any) => setPeriodType(newValue?.value)}
        margin="sm"
      />

      <HStack align="center">
        <IconButton
          variant="outlined"
          color="secondary"
          icon={ChevronLeftIcon}
          onClick={() => setDate(date.subtract(1, periodType))}
        />
        <div>
          {periodType === 'month' && `${date.format('MMM YYYY')}`}
          {periodType === 'year' && date.year()}
        </div>
        <IconButton
          variant="outlined"
          color="secondary"
          icon={ChevronRightIcon}
          onClick={() => setDate(date.add(1, periodType))}
        />
      </HStack>
    </div>
  );
};

export default DateFilter;
