import { FC } from "react";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";

import { CalendarIcon } from "../../../assets/svg";

interface CalendarButtonProps {
  date: Date;
  setDate: (date: Date) => void;
}

registerLocale("ru", ru);

const CalendarButton: FC<CalendarButtonProps> = ({ date, setDate }) => {
  return (
    <ReactDatePicker
      selected={date}
      onChange={(date) => date && setDate(date)}
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
