import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { FC } from 'react';

import { useAppSelector } from '../../hooks/reduxHooks';
import Button from '../../UI/Button';
import Card from '../../UI/Card';
import Checkbox from '../../UI/Form/Checkbox';
import { aesEncrypt } from '../../utils/crypto';
import { exportFile } from '../../utils/file';
import { getSyncData } from '../../utils/sync';

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
