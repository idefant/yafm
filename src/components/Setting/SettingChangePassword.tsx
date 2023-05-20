import { yupResolver } from '@hookform/resolvers/yup';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setPassword } from '../../store/reducers/appSlice';
import Button from '../../UI/Button';
import Card from '../../UI/Card';
import Form from '../../UI/Form';
import yup from '../../utils/form/schema';

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
  const password = useAppSelector((state) => state.app.password);
  const dispatch = useAppDispatch();

  const methods = useForm<TForm>({ resolver: yupResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const onSubmit = (values: TForm) => {
    if (values.oldPassword !== password) {
      Swal.fire({ title: 'Wrong password', icon: 'error' });
      return;
    }
    if (values.newPassword !== values.repeatPassword) {
      Swal.fire({ title: "Passwords don't match", icon: 'error' });
      return;
    }

    dispatch(setPassword(values.newPassword));
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
            <Button type="submit" color="green" className="!py-1.5">
              Change Password
            </Button>
          </Card.Footer>
        </Form>
      </FormProvider>
    </Card>
  );
};

export default SettingChangePassword;
