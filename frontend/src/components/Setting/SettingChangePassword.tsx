import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { z } from 'zod';

import { passwordSchema } from '#schema/commonSchema';
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

  const onSubmit = async (values: FormOutput) => {
    const isCorrectOldPassword = await crypt.checkPassword(values.oldPassword);
    if (!isCorrectOldPassword) {
      Swal.fire({ title: 'Wrong old password', icon: 'error' });
      reset({ oldPassword: '' });
      return;
    }
    if (values.newPassword !== values.repeatPassword) {
      Swal.fire({ title: "Passwords don't match", icon: 'error' });
      return;
    }

    await crypt.setSecret({ password: values.newPassword });
    await committer(actionCreator.changePassword()).sync();
    Swal.fire({ title: 'Password changed successfully', icon: 'success' });
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
