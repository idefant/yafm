import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';

export const configureDayjs = () => {
  dayjs.extend(customParseFormat);
  dayjs.extend(isBetween);
};
