import dayjs from 'dayjs';
import { FC } from 'react';
import { Link } from 'react-router-dom';

import { useFetchInfoQuery } from '#api/userApi';
import { TCipher } from '#types/cipher';
import { TTimestamp } from '#types/timestamp';
import GoBackButton from '#ui/Button/GoBackButton';
import EntranceTitle from '#ui/EntranceTitle';
import Icon from '#ui/Icon';
import Table, { TColumn } from '#ui/Table';

const Versions: FC = () => {
  const { data: user } = useFetchInfoQuery(undefined, { refetchOnMountOrArgChange: true });

  const tableColumns: TColumn<TCipher & TTimestamp & { id: string }>[] = [
    {
      title: '#',
      key: 'id',
      render: ({ index }) => index + 1,
    },
    {
      title: 'Date',
      key: 'date',
      render: ({ record }) => dayjs(record.createdAt).format('DD.MM.YYYY HH:mm'),
    },
    {
      key: 'actions',
      cellClassName: '!p-0',
      width: 'min',
      render: ({ record }) => (
        <div className="flex justify-center gap-2">
          <Link to={`/decrypt/${record.id}`} className="p-2">
            <Icon.Unlock className="w-7 h-7" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <GoBackButton />
      <EntranceTitle>Versions</EntranceTitle>

      <Table
        columns={tableColumns}
        data={user?.bases}
        getKey={(record) => record.id}
        className={{ table: 'w-full' }}
      />
    </div>
  );
};

export default Versions;
