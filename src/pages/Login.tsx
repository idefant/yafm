import { yupResolver } from '@hookform/resolvers/yup';
import { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import { useLoginMutation } from '../api/userApi';
import Button from '../ui2/Button';
import EntranceTitle from '../ui2/EntranceTitle';
import Form from '../ui2/Form';
import yup from '../utils/form/schema';

type TForm = {
  username: string;
  password: string;
};

const formSchema = yup
  .object({
    username: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

const Login: FC = () => {
  const methods = useForm<TForm>({ resolver: yupResolver(formSchema) });
  const { handleSubmit } = methods;

  const [login, { error }] = useLoginMutation();

  const onSubmit = async (values: TForm) => {
    login(values);
  };

  useEffect(() => {
    if (!error) return;
    Swal.fire({
      title: (error as any)?.data?.message || 'Что-то пошло не так',
      icon: 'error',
    });
  }, [error]);

  return (
    <>
      <EntranceTitle>Login</EntranceTitle>

      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Input name="username" label="Username" />
          <Form.Password name="password" label="Password" />

          <Button type="submit" color="green" className="block mt-8 mx-auto">
            Login
          </Button>
          <div className="text-slate-300 text-center mt-4">
            No account yet?{' '}
            <Link to="/register" className="underline underline-offset-4 text-white">
              Register
            </Link>
          </div>
        </Form>
      </FormProvider>
    </>
  );
};

export default Login;
