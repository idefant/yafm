import { yupResolver } from '@hookform/resolvers/yup';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

import { useChangePasswordMutation, useFetchInfoQuery } from '#api/userApi';
import Button from '#ui/Button';
import Form from '#ui/Form';
import Modal from '#ui/Modal';
import yup from '#utils/form/schema';

interface ChangePasswordModalProps {
  isOpen: boolean;
  close: () => void;
}

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

const ChangePasswordModal: FC<ChangePasswordModalProps> = ({ isOpen, close }) => {
  const methods = useForm<TForm>({ resolver: yupResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const [changePassword] = useChangePasswordMutation();
  const { data: user } = useFetchInfoQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const onSubmit = (values: TForm) => {
    if (!user) return;

    changePassword({
      username: user.username,
      password: values.oldPassword,
      new_password: values.newPassword,
    })
      .unwrap()
      .then(() => close())
      .catch(() => {
        Swal.fire({
          title: 'Something went wrong',
          icon: 'error',
        });
      });
  };

  const onExited = () => reset();

  return (
    <Modal isOpen={isOpen} close={close} onExited={onExited}>
      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header close={close}>Change Password</Modal.Header>
          <Modal.Content>
            <Form.Password label="Old password" name="oldPassword" />
            <Form.Password label="New password" name="newPassword" />
            <Form.Password label="Repeat password" name="repeatPassword" />
          </Modal.Content>
          <Modal.Footer>
            <Button color="green" type="submit">
              Change Password
            </Button>
            <Button color="gray" onClick={close}>
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </FormProvider>
    </Modal>
  );
};

export default ChangePasswordModal;
