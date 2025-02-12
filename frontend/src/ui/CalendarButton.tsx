import ru from 'date-fns/locale/ru';
import dayjs, { Dayjs } from 'dayjs';
import { FC } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';

import CalendarIcon from '#svg/calendar.svg?react';
import { IconButton } from '#ui/IconButton';

/* eslint-disable no-unused-vars */
interface CalendarButtonProps {
  date: Dayjs;
  setDate: (date: Dayjs) => void;
}
/* eslint-enable no-unused-vars */

registerLocale('ru', ru);

const CalendarButton: FC<CalendarButtonProps> = ({ date, setDate }) => (
  <ReactDatePicker
    selected={date.toDate()}
    onChange={(date) => date && setDate(dayjs(date))}
    locale="ru"
    showTimeSelect
    timeIntervals={30}
    customInput={<IconButton icon={CalendarIcon} />}
  />
);

export default CalendarButton;
