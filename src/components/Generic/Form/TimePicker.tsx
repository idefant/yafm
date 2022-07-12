import { FC, useEffect, useRef } from "react";
import { Dayjs } from "dayjs";

interface DatePickerProps {
  date: Dayjs;
  setDate: (date: Dayjs) => void;
}

const TimePicker: FC<DatePickerProps> = ({ date, setDate }) => {
  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    hourRef.current?.value && (hourRef.current.value = date.format("HH"));
    minuteRef.current?.value && (minuteRef.current.value = date.format("mm"));
  }, [date]);

  return (
    <div className="bg-gray-200 rounded-md px-3 py-1.5 border">
      <input
        className="bg-transparent focus:outline-none"
        type="text"
        ref={hourRef}
        defaultValue={date.format("HH")}
        size={2}
        onKeyDown={(e) => {
          switch (e.key) {
            case "ArrowUp":
              setDate(date.add(1, "hour"));
              break;
            case "ArrowDown":
              setDate(date.subtract(1, "hour"));
              break;
          }
        }}
      />
      <span>:</span>
      <input
        className="bg-transparent focus:outline-none"
        type="text"
        size={2}
        ref={minuteRef}
        defaultValue={date.format("mm")}
        onKeyDown={(e) => {
          switch (e.key) {
            case "ArrowUp":
              setDate(date.add(1, "minute"));
              break;
            case "ArrowDown":
              setDate(date.subtract(1, "minute"));
              break;
          }
        }}
      />
    </div>
  );
};

export default TimePicker;
