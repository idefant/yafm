import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '#ui/Button';
import Card from '#ui/Card';
import Form from '#ui/Form';
import { crypt } from '#utils/crypt';
import { exportJsonFile } from '#utils/file';
import yup from '#utils/form/schema';
import Gzip from '#utils/gzip';
import { getSyncData } from '#utils/sync';

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

  const onSubmit = async (values: TForm) => {
    const data = getSyncData();

    if (values.useEncryption) {
      const encryptedData = await crypt.encrypt(await Gzip.compress(JSON.stringify(data)));
      exportJsonFile(
        { created_at: dayjs().toISOString(), is_encrypted: true, data: encryptedData },
        'backup-enc.json',
      );
    } else {
      exportJsonFile(
        { created_at: dayjs().toISOString(), is_encrypted: false, data },
        'backup-decr.json',
      );
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
            <Button type="submit">Download</Button>
          </Card.Footer>
        </Form>
      </FormProvider>
    </Card>
  );
};

export default SettingBackup;
