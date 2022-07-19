import { Dayjs, QUnitType } from 'dayjs';
import { FC, useEffect, useRef } from 'react';

interface DatePickerProps {
  date: Dayjs;
  // eslint-disable-next-line no-unused-vars
  setDate: (date: Dayjs) => void;
}

const DatePicker: FC<DatePickerProps> = ({ date, setDate }) => {
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dayRef.current?.value) {
      (dayRef.current.value = date.format('DD'));
    }
    if (monthRef.current?.value) {
      (monthRef.current.value = date.format('MM'));
    }
    if (yearRef.current?.value) {
      (yearRef.current.value = date.format('YYYY'));
    }
  }, [date]);

  const setTimeKeyboard = (key: string, unit: QUnitType) => {
    const handlers = {
      ArrowUp: () => setDate(date.add(1, unit)),
      ArrowDown: () => setDate(date.subtract(1, unit)),
    };
    if (key in handlers) {
      handlers[key as keyof typeof handlers]();
    }
  };

  return (
    <div className="bg-gray-200 rounded-md px-3 py-1.5 border">
      <input
        className="bg-transparent focus:outline-none"
        type="text"
        defaultValue={date.format('DD')}
        ref={dayRef}
        size={2}
        onKeyDown={(e) => setTimeKeyboard(e.key, 'day')}
      />
      <span>.</span>
      <input
        className="bg-transparent focus:outline-none"
        type="text"
        size={2}
        defaultValue={date.format('MM')}
        ref={monthRef}
        onKeyDown={(e) => setTimeKeyboard(e.key, 'month')}
      />
      <span>.</span>
      <input
        className="bg-transparent focus:outline-none"
        type="text"
        size={4}
        defaultValue={date.format('YYYY')}
        ref={yearRef}
        onKeyDown={(e) => setTimeKeyboard(e.key, 'year')}
      />
    </div>
  );
};

export default DatePicker;
