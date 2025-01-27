import { yupResolver } from '@hookform/resolvers/yup';
import { FC, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

import { Button } from '#ui/Button';
import { Card } from '#ui/Card';
import Form from '#ui/Form';
import { Title } from '#ui/Typography';
import { actionCreator, committer } from '#utils/committer';
import { crypt } from '#utils/crypt';
import yup from '#utils/form/schema';

type TForm = {
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
};

const formSchema = yup
  .object({
    oldPassword: yup.string().required(),
    newPassword: yup.string().required(),
    repeatPassword: yup.string().required().repeatPassword('newPassword'),
  })
  .required();

const SettingChangePassword: FC = () => {
  const formId = useId();
  const methods = useForm<TForm>({ resolver: yupResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const onSubmit = async (values: TForm) => {
    if (await crypt.checkPassword(values.oldPassword)) {
      Swal.fire({ title: 'Wrong password', icon: 'error' });
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
    reset();
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

export default SettingChangePassword;
