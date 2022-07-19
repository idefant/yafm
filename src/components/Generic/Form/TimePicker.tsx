import { Dayjs, QUnitType } from 'dayjs';
import { FC, useEffect, useRef } from 'react';

interface DatePickerProps {
  date: Dayjs;
  // eslint-disable-next-line no-unused-vars
  setDate: (date: Dayjs) => void;
}

const TimePicker: FC<DatePickerProps> = ({ date, setDate }) => {
  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hourRef.current?.value) {
      hourRef.current.value = date.format('HH');
    }
    if (minuteRef.current?.value) {
      minuteRef.current.value = date.format('mm');
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
        ref={hourRef}
        defaultValue={date.format('HH')}
        size={2}
        onKeyDown={(e) => setTimeKeyboard(e.key, 'hour')}
      />
      <span>:</span>
      <input
        className="bg-transparent focus:outline-none"
        type="text"
        size={2}
        ref={minuteRef}
        defaultValue={date.format('mm')}
        onKeyDown={(e) => setTimeKeyboard(e.key, 'minute')}
      />
    </div>
  );
};

export default TimePicker;
