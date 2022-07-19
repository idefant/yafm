import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { FC } from 'react';

import { aesEncrypt } from '../../../helper/crypto';
import { exportFile } from '../../../helper/file';
import { getSyncData } from '../../../helper/sync';
import { useAppSelector } from '../../../hooks/reduxHooks';
import Button from '../../Generic/Button/Button';
import Checkbox from '../../Generic/Form/Checkbox';

const SettingBackup: FC = () => {
  const password = useAppSelector((state) => state.app.password);

  type TForm = {
    useEncryption: boolean;
  };

  const downloadBackup = (values: TForm) => {
    if (!password) return;

    const data = getSyncData();
    const infoData = {
      created_at: dayjs().toISOString(),
      is_encrypted: values.useEncryption,
    };

    exportFile(
      JSON.stringify({
        ...infoData,
        data: values.useEncryption
          ? aesEncrypt(JSON.stringify(data), password)
          : data,
      }),
      values.useEncryption ? 'backup-enc.json' : 'backup-decr.json',
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
