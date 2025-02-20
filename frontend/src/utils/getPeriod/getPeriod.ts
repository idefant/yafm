import dayjs, { ConfigType, Dayjs } from 'dayjs';

import { dayjsTemplate } from '#configs/dayjs';
import { createArray } from '#utils/createArray';

export const getPeriod = (date: ConfigType, unit: 'month' | 'year') => {
  const startedAt = dayjs(date).startOf(unit);
  const nextPeriodStartedAt = startedAt.add(1, unit);
  const endedAt = nextPeriodStartedAt.subtract(1, 'millisecond');
  const daysCount = nextPeriodStartedAt.diff(startedAt, 'day');

  const data = {
    startedAt,
    endedAt,
    unit,
    daysCount,
    formatted: startedAt.format(dayjsTemplate[unit]),
    dateList: [] as Dayjs[],
    monthList: [] as Dayjs[],
    includes: (date: ConfigType) => dayjs(date).isBetween(startedAt, endedAt, 'milliseconds', '[]'),
  };

  return new Proxy(data, {
    get: (target, p) => {
      if (typeof p === 'symbol') return;

      if (p === 'dateList') {
        if (target.dateList.length === 0) {
          target.dateList = createArray(daysCount, (i) => startedAt.add(i, 'day'));
        }
        return target.dateList;
      }

      if (p === 'monthList') {
        if (target.monthList.length === 0) {
          const monthCount = nextPeriodStartedAt.diff(target.startedAt, 'month', true);
          target.monthList = createArray(monthCount, (i) => startedAt.add(i, 'month'));
        }
        return target.monthList;
      }

      if (p in target) {
        return target[p as keyof typeof target];
      }
    },
  });
};

export type Period = ReturnType<typeof getPeriod>;
