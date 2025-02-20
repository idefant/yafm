import dayjs, { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';

import { getPeriod } from '#utils/getPeriod';

type PeriodType = 'year' | 'month';

type DateFilterOptions = {
  date?: Dayjs;
  unit?: PeriodType;
};

export const useDateFilter = (defaultOptions: DateFilterOptions = {}) => {
  const [date, setDate] = useState(defaultOptions.date ?? dayjs());
  const [unit, setUnit] = useState<PeriodType>(defaultOptions.unit ?? 'month');

  const period = useMemo(() => getPeriod(date, unit), [date, unit]);

  return {
    setDate,
    setUnit,
    period,
  };
};

export type DateFilterReturn = ReturnType<typeof useDateFilter>;
