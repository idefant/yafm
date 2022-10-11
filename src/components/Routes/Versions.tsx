import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FC, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import { exportFile } from '../../helper/file';
import {
  getVersionListRequest,
  getVersionByFilenameRequest,
} from '../../helper/requests/versionRequests';
import { useAppSelector } from '../../hooks/reduxHooks';
import useAsyncEff from '../../hooks/useAsyncEffect';
import GoBackButton from '../Generic/Button/GoBackButton';
import EntranceTitle from '../Generic/EntranceTitle';
import Icon from '../Generic/Icon';
import Table, { TColumn, TableAction } from '../Generic/Table';

dayjs.extend(customParseFormat);

const Versions: FC = () => {
  const { isVersioningEnabled, vaultUrl } = useAppSelector(
    (state) => state.app,
  );
  const [versions, setVersions] = useState<
    { filename: string; date: string }[]
  >([]);

  useAsyncEff(async () => {
    const response = await getVersionListRequest(vaultUrl);
    if (!response) return;

    setVersions(
      response.data.map((filename: string) => ({
        filename,
        date: dayjs(filename, 'YYYYMMDD_HHmm.json').format('DD.MM.YYYY (HH:mm)'),
      })),
    );
  }, [vaultUrl]);

  const downloadVersion = async (filename: string) => {
    const response = await getVersionByFilenameRequest(filename, vaultUrl);
    if (!response) return;

    exportFile(
      JSON.stringify({
        data: response.data,
        created_at: dayjs(filename, 'YYYYMMDD_HHmm.json').toISOString(),
        is_encrypted: true,
      }),
      'backup-enc.yafm',
    );
  };

  if (!isVersioningEnabled) {
    return <Navigate to="/decrypt" />;
  }

  const tableColumns: TColumn<{ filename: string; date: string }>[] = [
    {
      title: '#',
      key: 'id',
      render: ({ index }) => index + 1,
    },
    {
      title: 'Date',
      key: 'date',
    },
    {
      key: 'actions',
      cellClassName: '!p-0',
      width: 'min',
      render: ({ record }) => (
        <div className="flex justify-center gap-2">
          <Link to={`/decrypt/${record.filename}`} className="p-2">
            <Icon.Unlock className="w-7 h-7" />
          </Link>
          <TableAction
            onClick={() => downloadVersion(record.filename)}
            icon={Icon.Download}
          />
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
        data={versions}
        getKey={(record) => record.filename}
        className={{ table: 'w-full' }}
      />
    </div>
  );
};

export default Versions;
