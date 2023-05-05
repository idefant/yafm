import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { FC } from 'react';

import { aesEncrypt } from '../../../helper/crypto';
import { exportFile } from '../../../helper/file';
import { getSyncData } from '../../../helper/sync';
import { useAppSelector } from '../../../hooks/reduxHooks';
import Button from '../../Generic/Button/Button';
import Card from '../../Generic/Card';
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
        data: values.useEncryption ? aesEncrypt(JSON.stringify(data), password) : data,
      }),
      values.useEncryption ? 'backup-enc.json' : 'backup-decr.json',
    );
  };

  const formik = useFormik<TForm>({
    initialValues: { useEncryption: true },
    onSubmit: downloadBackup,
  });

  return (
    <Card>
      <Card.Header>Backup</Card.Header>

      <form onSubmit={formik.handleSubmit}>
        <Card.Body>
          <div className="flex gap-8 items-center">
            <Checkbox
              id="useEncryption"
              checked={formik.values.useEncryption}
              onChange={formik.handleChange}
            >
              Use encryption
            </Checkbox>
          </div>
        </Card.Body>

        <Card.Footer>
          <Button color="green" type="submit" className="!py-1.5">
            Download
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
};

export default SettingBackup;
