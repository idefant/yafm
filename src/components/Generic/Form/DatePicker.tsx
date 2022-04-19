import { FC, useEffect, useRef } from "react";

interface DatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

const DatePicker: FC<DatePickerProps> = ({ date, setDate }) => {
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dayRef.current?.value &&
      (dayRef.current.value = date.toLocaleString("ru", { day: "2-digit" }));
    monthRef.current?.value &&
      (monthRef.current.value = date.toLocaleString("ru", {
        month: "2-digit",
      }));
    yearRef.current?.value &&
      (yearRef.current.value = date.toLocaleString("ru", { year: "numeric" }));
  }, [date]);

  return (
    <div className="bg-gray-200 rounded-md px-3 py-1.5 border">
      <input
        className="bg-transparent focus:outline-none"
        type="text"
        defaultValue={date.toLocaleString("ru", { day: "2-digit" })}
        ref={dayRef}
        size={2}
        onKeyDown={(e) => {
          const updatedDate = new Date(date);
          switch (e.key) {
            case "ArrowUp":
              updatedDate.setDate(date.getDate() + 1);
              break;
            case "ArrowDown":
              updatedDate.setDate(date.getDate() - 1);
              break;
          }
          setDate(updatedDate);
        }}
      />
      <span>.</span>
      <input
        className="bg-transparent focus:outline-none"
        type="text"
        size={2}
        defaultValue={date.toLocaleString("ru", { month: "2-digit" })}
        ref={monthRef}
        onKeyDown={(e) => {
          const updatedDate = new Date(date);
          switch (e.key) {
            case "ArrowUp":
              updatedDate.setMonth(date.getMonth() + 1);
              break;
            case "ArrowDown":
              updatedDate.setMonth(date.getMonth() - 1);
              break;
          }
          setDate(updatedDate);
        }}
      />
      <span>.</span>
      <input
        className="bg-transparent focus:outline-none"
        type="text"
        size={4}
        defaultValue={date.toLocaleString("ru", { year: "numeric" })}
        ref={yearRef}
        onKeyDown={(e) => {
          const updatedDate = new Date(date);
          switch (e.key) {
            case "ArrowUp":
              updatedDate.setFullYear(date.getFullYear() + 1);
              break;
            case "ArrowDown":
              updatedDate.setFullYear(date.getFullYear() - 1);
              break;
          }
          setDate(updatedDate);
        }}
      />
    </div>
  );
};

export default DatePicker;
