import { FC } from 'react';

import Select from '../Form/Select';
import Icon from '../Icon';

import { TDateFilter } from './useDateFilter';

interface DateFilterProps {
  options: TDateFilter;
}

const DateFilter: FC<DateFilterProps> = ({ options }) => {
  const {
    date, periodType, setDate, setPeriodType,
  } = options;

  const periodOptions = [
    { value: 'month', label: 'Month' },
    { value: 'quarter', label: 'Quarter' },
    { value: 'year', label: 'Year' },
  ];

  return (
    <div className="flex gap-3 items-center">
      <Select
        className="border-gray-600"
        options={periodOptions}
        name="categoryId"
        value={periodOptions.find((option) => (option.value === periodType))}
        onChange={(newValue: any) => setPeriodType(newValue?.value)}
      />
      <button
        onClick={() => setDate(date.subtract(1, periodType))}
        className="p-2 bg-slate-700 border border-slate-100/30 rounded-full"
        type="button"
      >
        <Icon.ChevronLeft />
      </button>
      <div>
        {periodType === 'month' && `${date.format('MMM YYYY')}`}
        {periodType === 'quarter'
          && date.format(`Q${date.quarter()} YYYY`)}
        {periodType === 'year' && date.year()}
      </div>
      <button
        onClick={() => setDate(date.add(1, periodType))}
        className="p-2 bg-slate-700 border border-slate-100/30 rounded-full"
        type="button"
      >
        <Icon.ChevronRight />
      </button>
    </div>
  );
};

export default DateFilter;
