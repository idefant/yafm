import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useId, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { passwordSchema } from '#schema/commonSchema';
import { Alert, AlertColor } from '#ui/Alert';
import { Button } from '#ui/Button';
import { Card } from '#ui/Card';
import { Form } from '#ui/Form';
import { Title } from '#ui/Typography';
import { actionCreator, committer } from '#utils/committer';
import { crypt } from '#utils/crypt';

const formSchema = z
  .object({
    oldPassword: z.string().nonempty(),
    newPassword: passwordSchema,
    repeatPassword: z.string().nonempty(),
  })
  .refine((data) => data.newPassword === data.repeatPassword, {
    message: 'Пароли не совпадают',
    path: ['repeatPassword'],
  });

type FormOutput = z.infer<typeof formSchema>;

export const SettingChangePassword: FC = () => {
  const formId = useId();
  const methods = useForm<FormOutput>({ resolver: zodResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const [alert, setAlert] = useState<{ color: AlertColor; text: string }>();

  const onSubmit = async (values: FormOutput) => {
    setAlert(undefined);

    const isCorrectOldPassword = await crypt.checkPassword(values.oldPassword);
    if (!isCorrectOldPassword) {
      setAlert({ color: 'danger', text: 'Wrong old password' });
      reset({ oldPassword: '' });
      return;
    }

    await crypt.setSecret({ password: values.newPassword });
    await committer(actionCreator.changePassword()).sync();
    setAlert({ color: 'success', text: 'Password changed successfully' });
    setTimeout(() => {
      setAlert((currentAlert) => (currentAlert?.color === 'success' ? undefined : currentAlert));
    }, 10_000);
    reset({
      oldPassword: '',
      newPassword: '',
      repeatPassword: '',
    });
  };

  return (
    <Card>
      <Card.Content>
        <Title level={4} gutterBottom>
          Change Password
        </Title>

        <Alert color={alert?.color} text={alert?.text} />

        <FormProvider {...methods}>
          <Form id={formId} onSubmit={handleSubmit(onSubmit)}>
            <Form.Password label="Old password" name="oldPassword" />
            <Form.Password label="New password" name="newPassword" />
            <Form.Password label="Repeat password" name="repeatPassword" />
          </Form>
        </FormProvider>
      </Card.Content>

      <Card.Actions>
        <Button type="submit" form={formId}>
          Change Password
        </Button>
      </Card.Actions>
    </Card>
  );
};
