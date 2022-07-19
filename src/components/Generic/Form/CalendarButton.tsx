import ru from 'date-fns/locale/ru';
import dayjs, { Dayjs } from 'dayjs';
import { FC } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';

import { CalendarIcon } from '../../../assets/svg';

interface CalendarButtonProps {
  date: Dayjs;
  // eslint-disable-next-line no-unused-vars
  setDate: (date: Dayjs) => void;
}

registerLocale('ru', ru);

const CalendarButton: FC<CalendarButtonProps> = ({ date, setDate }) => (
  <ReactDatePicker
    selected={date.toDate()}
    onChange={(date) => date && setDate(dayjs(date))}
    locale="ru"
    showTimeSelect
    timeIntervals={30}
    customInput={(
      <button className="p-1" type="button">
        <CalendarIcon />
      </button>
      )}
    wrapperClassName="!w-fit"
  />
);

export default CalendarButton;
