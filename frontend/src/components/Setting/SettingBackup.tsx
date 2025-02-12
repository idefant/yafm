import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { FC, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '#ui/Button';
import { Card } from '#ui/Card';
import { Form } from '#ui/Form';
import { Title } from '#ui/Typography';
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

export const SettingBackup: FC = () => {
  const formId = useId();
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
      <Card.Content>
        <Title level={4} gutterBottom>
          Backup
        </Title>

        <FormProvider {...methods}>
          <Form id={formId} onSubmit={handleSubmit(onSubmit)}>
            <Form.Checkbox name="useEncryption">Use encryption</Form.Checkbox>
          </Form>
        </FormProvider>
      </Card.Content>

      <Card.Actions>
        <Button type="submit" form={formId}>
          Download
        </Button>
      </Card.Actions>
    </Card>
  );
};
