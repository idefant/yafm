import { FC } from "react";
import { useFormik } from "formik";

import { exportFile } from "../../../helper/file";
import { aesEncrypt } from "../../../helper/crypto";
import { getSyncData } from "../../../helper/sync";
import { useAppSelector } from "../../../hooks/reduxHooks";
import Checkbox from "../../Generic/Form/Checkbox";
import Button from "../../Generic/Button/Button";

const SettingBackup: FC = () => {
  const { aesPass } = useAppSelector((state) => state.user);

  type TForm = {
    useEncryption: boolean;
  };

  const downloadBackup = (values: TForm) => {
    if (!aesPass) return;

    const data = getSyncData();
    const infoData = {
      created_at: new Date().toISOString(),
      is_encrypted: values.useEncryption,
    };

    exportFile(
      JSON.stringify({
        data: values.useEncryption
          ? aesEncrypt(JSON.stringify(data), aesPass)
          : data,
        ...infoData,
      }),
      values.useEncryption ? "backup-enc.yafm" : "backup-decr.yafm"
    );
  };

  const formik = useFormik<TForm>({
    initialValues: { useEncryption: true },
    onSubmit: downloadBackup,
  });

  return (
    <>
      <h2 className="text-2xl font-bold underline pb-3 mt-12">Backup</h2>

      <form onSubmit={formik.handleSubmit}>
        <div className="flex gap-8 items-center">
          <div>
            <Checkbox
              id="useEncryption"
              checked={formik.values.useEncryption}
              onChange={formik.handleChange}
            >
              Use encryption
            </Checkbox>
          </div>
          <Button color="green" type="submit">
            Download
          </Button>
        </div>
      </form>
    </>
  );
};

export default SettingBackup;