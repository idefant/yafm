import { yupResolver } from '@hookform/resolvers/yup';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

import { Button } from '#ui/Button';
import Card from '#ui/Card';
import Form from '#ui/Form';
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
      <Card.Header>Change Password</Card.Header>

      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Card.Body>
            <Form.Password label="Old password" name="oldPassword" />
            <Form.Password label="New password" name="newPassword" />
            <Form.Password label="Repeat password" name="repeatPassword" />
          </Card.Body>

          <Card.Footer>
            <Button type="submit">Change Password</Button>
          </Card.Footer>
        </Form>
      </FormProvider>
    </Card>
  );
};

export default SettingChangePassword;
