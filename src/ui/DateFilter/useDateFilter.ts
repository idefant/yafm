import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

import { TPeriod } from '../../types/periodType';

export type TDateFilterOptions = {
  date: Dayjs;
  periodType: TPeriod;
};

export type TDateFilter = TDateFilterOptions & {
  setDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  setPeriodType: React.Dispatch<React.SetStateAction<TPeriod>>;
};

const useDateFilter = (defaultOptions: Partial<TDateFilterOptions> = {}): TDateFilter => {
  const [date, setDate] = useState(defaultOptions.date ?? dayjs());
  const [periodType, setPeriodType] = useState<TPeriod>(defaultOptions.periodType ?? 'month');

  return {
    date,
    setDate,
    periodType,
    setPeriodType,
  };
};

export default useDateFilter;
