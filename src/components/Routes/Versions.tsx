import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FC, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import { exportFile } from '../../helper/file';
import {
  getVersionListRequest,
  getVersionByFilenameRequest,
} from '../../helper/requests/versionRequests';
import { useAppSelector } from '../../hooks/reduxHooks';
import ButtonLink from '../Generic/Button/ButtonLink';
import Icon from '../Generic/Icon';
import Table, {
  THead, TR, TH, TBody, TD, TDIcon,
} from '../Generic/Table';

dayjs.extend(customParseFormat);

const Versions: FC = () => {
  const { isVersioningEnabled, vaultUrl } = useAppSelector(
    (state) => state.app,
  );
  const [versions, setVersions] = useState<
    { filename: string; date: string }[]
  >([]);

  useEffect(() => {
    (async () => {
      const response = await getVersionListRequest(vaultUrl);
      if (!response) return;

      setVersions(
        response.data.map((filename: string) => ({
          filename,
          date: dayjs(filename, 'YYYYMMDD_HHmm.json').format('DD.MM.YYYY (HH:mm)'),
        })),
      );
    })();
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

  return (
    <div>
      <h1 className="text-3xl font-bold underline text-center mb-7">
        Versions
      </h1>

      {versions.length === 0 ? (
        <div className="text-center">
          <div className="font-sans text-3xl my-10">¯\_(ツ)_/¯</div>
          <ButtonLink to="/decrypt/last" color="gray">
            Back
          </ButtonLink>
        </div>
      ) : (
        <Table className="w-full">
          <THead>
            <TR>
              <TH>ID</TH>
              <TH>Date</TH>
              <TH />
              <TH />
            </TR>
          </THead>
          <TBody>
            {versions.map((version, i) => (
              <TR key={version.filename}>
                <TD>{i + 1}</TD>
                <TD>{version.date}</TD>
                <TDIcon>
                  <Link to={`/decrypt/${version.filename}`}>
                    <Icon.Unlock className="w-7 h-7" />
                  </Link>
                </TDIcon>
                <TDIcon>
                  <button
                    className="p-2"
                    onClick={() => downloadVersion(version.filename)}
                    type="button"
                  >
                    <Icon.Download className="w-7 h-7" />
                  </button>
                </TDIcon>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
};

export default Versions;
