import { DateTime } from "luxon";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { DownloadIcon, TrashIcon, UnlockIcon } from "../../assets/svg";
import { exportFile } from "../../helper/file";
import {
  deleteVersionByIdRequest,
  getAllVersionsRequest,
  getVersionByIdRequest,
} from "../../helper/requests/versionRequests";
import store from "../../store";
import Table, { THead, TR, TH, TBody, TD, TDIcon } from "../Generic/Table";

type TVersion = { id: number; createdAt: string };

const Versions: FC = observer(() => {
  const [versions, setVersions] = useState<TVersion[]>([]);
  const { accessToken, api } = store.user;

  useEffect(() => {
    if (!accessToken || !api) return;

    (async () => {
      const response = await getAllVersionsRequest(accessToken, api);
      if (!response) return;

      setVersions(
        response.data.map((version: { id: number; created_at: string }) => ({
          ...version,
          createdAt: DateTime.fromISO(version.created_at).toFormat(
            "dd.MM.yyyy - HH:mm"
          ),
        }))
      );
    })();
  }, [accessToken, api]);

  const downloadVersion = async (versionId: number) => {
    if (!accessToken || !api) return;

    const response = await getVersionByIdRequest(versionId, accessToken, api);
    if (!response) return;

    exportFile(
      JSON.stringify({
        cipher: response.data.cipher,
        iv: response.data.iv,
        hmac: response.data.hmac,
      }),
      "backup-enc.yafm"
    );
  };

  const deleteVersion = (deletedVersion: TVersion) => {
    Swal.fire({
      title: "Delete version",
      icon: "error",
      text: deletedVersion.createdAt,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed && accessToken && api) {
        deleteVersionByIdRequest(deletedVersion.id, accessToken, api);
        setVersions(
          versions.filter((version) => version.id !== deletedVersion.id)
        );
      }
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold underline text-center mb-7">
        Versions
      </h1>

      <Table className="w-full">
        <THead>
          <TR>
            <TH>ID</TH>
            <TH>Date</TH>
            <TH></TH>
            <TH></TH>
            <TH></TH>
          </TR>
        </THead>
        <TBody>
          {versions.map((version) => (
            <TR key={version.id}>
              <TD>{version.id}</TD>
              <TD>{version.createdAt}</TD>
              <TDIcon>
                <Link to={`/decrypt/${version.id}`}>
                  <UnlockIcon className="w-7 h-7" />
                </Link>
              </TDIcon>
              <TDIcon>
                <button
                  className="p-2"
                  onClick={() => downloadVersion(version.id)}
                >
                  <DownloadIcon className="w-7 h-7" />
                </button>
              </TDIcon>
              <TDIcon>
                <button className="p-2" onClick={() => deleteVersion(version)}>
                  <TrashIcon className="w-7 h-7" />
                </button>
              </TDIcon>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
});

export default Versions;
