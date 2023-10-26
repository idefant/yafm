import classNames from 'classnames';
import { Dayjs, ManipulateType } from 'dayjs';
import { FC } from 'react';

interface DatePickerProps {
  date: Dayjs;
  // eslint-disable-next-line no-unused-vars
  setDate: (date: Dayjs) => void;
}

const DatePicker: FC<DatePickerProps> = ({ date, setDate }) => {
  const setTimeKeyboard = (key: string, unit: ManipulateType) => {
    const handlers = {
      ArrowUp: () => setDate(date.add(1, unit)),
      ArrowDown: () => setDate(date.subtract(1, unit)),
    };
    if (key in handlers) {
      handlers[key as keyof typeof handlers]();
    }
  };

  return (
    <div className="flex gap-2">
      <DatePickerCard>
        <DatePickerElement
          value={date.format('DD')}
          onKeyDown={(e) => setTimeKeyboard(e.key, 'day')}
          className="w-5"
        />
        <span>.</span>
        <DatePickerElement
          value={date.format('MM')}
          onKeyDown={(e) => setTimeKeyboard(e.key, 'month')}
          className="w-5"
        />
        <span>.</span>
        <DatePickerElement
          value={date.format('YYYY')}
          onKeyDown={(e) => setTimeKeyboard(e.key, 'year')}
          className="w-10"
        />
      </DatePickerCard>

      <DatePickerCard>
        <DatePickerElement
          value={date.format('HH')}
          onKeyDown={(e) => setTimeKeyboard(e.key, 'hour')}
          className="w-6"
        />
        <span>:</span>
        <DatePickerElement
          value={date.format('mm')}
          onKeyDown={(e) => setTimeKeyboard(e.key, 'minute')}
          className="w-6"
        />
      </DatePickerCard>
    </div>
  );
};

const DatePickerCard: FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={classNames(
      'bg-slate-700 rounded-md px-3 py-1.5 border border-slate-100/30',
      className,
    )}
    {...props}
  />
);

const DatePickerElement: FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  ...props
}) => (
  <input
    className={classNames(
      'bg-transparent focus:outline-none text-center transition-shadow focus:shadow-[0_1px_0_0_#fff]',
      className,
    )}
    type="text"
    onChange={(e) => e.preventDefault()}
    readOnly
    {...props}
  />
);

export default DatePicker;
