import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

import { Period } from '#types/periodType';

export type DateFilterOptions = {
  date: Dayjs;
  periodType: Period;
};

export type DateFilterResult = DateFilterOptions & {
  setDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  setPeriodType: React.Dispatch<React.SetStateAction<Period>>;
};

const useDateFilter = (defaultOptions: Partial<DateFilterOptions> = {}): DateFilterResult => {
  const [date, setDate] = useState(defaultOptions.date ?? dayjs());
  const [periodType, setPeriodType] = useState<Period>(defaultOptions.periodType ?? 'month');

  return {
    date,
    setDate,
    periodType,
    setPeriodType,
  };
};

export default useDateFilter;
