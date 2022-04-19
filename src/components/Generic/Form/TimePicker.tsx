import { FC, useEffect, useRef } from "react";

interface DatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

const TimePicker: FC<DatePickerProps> = ({ date, setDate }) => {
  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    hourRef.current?.value &&
      (hourRef.current.value = date.toLocaleString("ru", { hour: "2-digit" }));
    minuteRef.current?.value &&
      (minuteRef.current.value = date.toLocaleString("ru", {
        minute: "2-digit",
      }));
  }, [date]);

  return (
    <div className="bg-gray-200 rounded-md px-3 py-1.5 border">
      <input
        className="bg-transparent focus:outline-none"
        type="text"
        ref={hourRef}
        defaultValue={date.toLocaleString("ru", { hour: "2-digit" })}
        size={2}
        onKeyDown={(e) => {
          const updatedDate = new Date(date);
          switch (e.key) {
            case "ArrowUp":
              updatedDate.setHours(date.getHours() + 1);
              break;
            case "ArrowDown":
              updatedDate.setHours(date.getHours() - 1);
              break;
          }
          setDate(updatedDate);
        }}
      />
      <span>:</span>
      <input
        className="bg-transparent focus:outline-none"
        type="text"
        size={2}
        ref={minuteRef}
        defaultValue={date.toLocaleString("ru", { minute: "2-digit" })}
        onKeyDown={(e) => {
          const updatedDate = new Date(date);
          switch (e.key) {
            case "ArrowUp":
              updatedDate.setMinutes(date.getMinutes() + 1);
              break;
            case "ArrowDown":
              updatedDate.setMinutes(date.getMinutes() - 1);
              break;
          }
          setDate(updatedDate);
        }}
      />
    </div>
  );
};

export default TimePicker;
