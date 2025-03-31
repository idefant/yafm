import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { FC, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import Cryptor from '#modules/Cryptor';
import { BaseFileData } from '#types/baseType';
import { Button } from '#ui/Button';
import { Card } from '#ui/Card';
import { Form } from '#ui/Form';
import { Title } from '#ui/Typography';
import { exportJsonFile } from '#utils/file';
import { getSyncData } from '#utils/sync';

const formSchema = z.object({
  useEncryption: z.boolean(),
});

type FormOutput = z.infer<typeof formSchema>;

export const SettingBackup: FC = () => {
  const formId = useId();
  const methods = useForm<FormOutput>({ resolver: zodResolver(formSchema) });
  const { handleSubmit } = methods;

  const onSubmit = async (values: FormOutput) => {
    const data = getSyncData();

    if (values.useEncryption) {
      const encryptedData = await Cryptor.encrypt(data);
      const fileData: BaseFileData = {
        createdAt: dayjs().toISOString(),
        isEncrypted: true,
        data: encryptedData,
      };
      exportJsonFile(fileData, 'backup-enc.json');
    } else {
      const fileData: BaseFileData = {
        createdAt: dayjs().toISOString(),
        isEncrypted: false,
        data,
      };
      exportJsonFile(fileData, 'backup-decr.json');
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
