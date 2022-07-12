import { FC, useEffect, useRef } from "react";
import { Dayjs } from "dayjs";

interface DatePickerProps {
  date: Dayjs;
  setDate: (date: Dayjs) => void;
}

const DatePicker: FC<DatePickerProps> = ({ date, setDate }) => {
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dayRef.current?.value && (dayRef.current.value = date.format("DD"));
    monthRef.current?.value && (monthRef.current.value = date.format("MM"));
    yearRef.current?.value && (yearRef.current.value = date.format("YYYY"));
  }, [date]);

  return (
    <div className="bg-gray-200 rounded-md px-3 py-1.5 border">
      <input
        className="bg-transparent focus:outline-none"
        type="text"
        defaultValue={date.format("DD")}
        ref={dayRef}
        size={2}
        onKeyDown={(e) => {
          switch (e.key) {
            case "ArrowUp":
              setDate(date.add(1, "day"));
              break;
            case "ArrowDown":
              setDate(date.subtract(1, "day"));
              break;
          }
        }}
      />
      <span>.</span>
      <input
        className="bg-transparent focus:outline-none"
        type="text"
        size={2}
        defaultValue={date.format("MM")}
        ref={monthRef}
        onKeyDown={(e) => {
          switch (e.key) {
            case "ArrowUp":
              setDate(date.add(1, "month"));
              break;
            case "ArrowDown":
              setDate(date.subtract(1, "month"));
              break;
          }
        }}
      />
      <span>.</span>
      <input
        className="bg-transparent focus:outline-none"
        type="text"
        size={4}
        defaultValue={date.format("YYYY")}
        ref={yearRef}
        onKeyDown={(e) => {
          switch (e.key) {
            case "ArrowUp":
              setDate(date.add(1, "year"));
              break;
            case "ArrowDown":
              setDate(date.subtract(1, "year"));
              break;
          }
        }}
      />
    </div>
  );
};

export default DatePicker;
