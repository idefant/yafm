import { Dayjs } from 'dayjs';
import { FC } from 'react';

interface TableDateProps {
  date: Dayjs;
}

const TableDate: FC<TableDateProps> = ({ date }) => (
  <div className="text-center">
    <div>{date.format('DD.MM.YYYY')}</div>
    <div className="text-sm">{date.format('HH:mm')}</div>
  </div>
);

export default TableDate;
