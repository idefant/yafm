import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Gzip from '#utils/gzip';

import { useAppSelector } from '../../hooks/reduxHooks';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import Form from '../../ui/Form';
import { aesEncrypt } from '../../utils/crypto';
import { exportFile } from '../../utils/file';
import yup from '../../utils/form/schema';
import { getSyncData } from '../../utils/sync';

type TForm = {
  useEncryption: boolean;
};

const formSchema = yup
  .object({
    useEncryption: yup.bool(),
  })
  .required();

const SettingBackup: FC = () => {
  const methods = useForm<TForm>({ resolver: yupResolver(formSchema) });
  const { handleSubmit } = methods;

  const password = useAppSelector((state) => state.app.password);

  const onSubmit = async (values: TForm) => {
    if (!password) return;

    const data = getSyncData();
    const infoData = {
      created_at: dayjs().toISOString(),
      is_encrypted: values.useEncryption,
    };

    if (values.useEncryption) {
      exportFile(
        JSON.stringify({
          ...infoData,
          data: aesEncrypt(await Gzip.compress(JSON.stringify(data)), password),
        }),
        'backup-enc.json',
      );
    } else {
      exportFile(JSON.stringify({ ...infoData, data }), 'backup-decr.json');
    }
  };

  return (
    <Card>
      <Card.Header>Backup</Card.Header>

      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Card.Body>
            <Form.Checkbox name="useEncryption">Use encryption</Form.Checkbox>
          </Card.Body>

          <Card.Footer>
            <Button color="green" type="submit" className="!py-1.5">
              Download
            </Button>
          </Card.Footer>
        </Form>
      </FormProvider>
    </Card>
  );
};

export default SettingBackup;
