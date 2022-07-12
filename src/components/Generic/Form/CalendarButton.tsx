import { FC } from "react";
import dayjs, { Dayjs } from "dayjs";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";

import { CalendarIcon } from "../../../assets/svg";

interface CalendarButtonProps {
  date: Dayjs;
  setDate: (date: Dayjs) => void;
}

registerLocale("ru", ru);

const CalendarButton: FC<CalendarButtonProps> = ({ date, setDate }) => {
  return (
    <ReactDatePicker
      selected={date.toDate()}
      onChange={(date) => date && setDate(dayjs(date))}
      locale="ru"
      showTimeSelect
      timeIntervals={30}
      customInput={
        <button className="p-1" type="button">
          <CalendarIcon />
        </button>
      }
      wrapperClassName="!w-fit"
    />
  );
};

export default CalendarButton;
