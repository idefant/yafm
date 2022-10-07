import { useFormik } from 'formik';
import { FC } from 'react';
import Swal from 'sweetalert2';
import { object, string } from 'yup';

import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { setPassword } from '../../../store/reducers/appSlice';
import Button from '../../Generic/Button/Button';
import Card from '../../Generic/Card';
import FormField from '../../Generic/Form/FormField';

const SettingChangePassword: FC = () => {
  const password = useAppSelector((state) => state.app.password);
  const dispatch = useAppDispatch();

  type TForm = {
    oldPassword: string;
    newPassword: string;
    repeatPassword: string;
  };

  const changePassword = (values: TForm) => {
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
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      repeatPassword: '',
    },
    onSubmit: changePassword,
    validationSchema: object({
      oldPassword: string().required(),
      newPassword: string().required(),
      repeatPassword: string().required(),
    }),
    validateOnChange: false,
    validateOnBlur: true,
  });

  return (
    <Card>
      <Card.Header>Change Password</Card.Header>

      <form onSubmit={formik.handleSubmit}>
        <Card.Body>
          <FormField
            label="Old password"
            value={formik.values.oldPassword}
            onChange={formik.handleChange}
            name="oldPassword"
            type="password"
            onBlur={() => formik.validateField('oldPassword')}
            withError={Boolean(formik.errors.oldPassword)}
          />

          <FormField
            label="New password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            name="newPassword"
            type="password"
            onBlur={() => formik.validateField('newPassword')}
            withError={Boolean(formik.errors.newPassword)}
          />

          <FormField
            label="Repeat password"
            value={formik.values.repeatPassword}
            onChange={formik.handleChange}
            name="repeatPassword"
            type="password"
            onBlur={() => formik.validateField('repeatPassword')}
            withError={Boolean(formik.errors.repeatPassword)}
          />
        </Card.Body>

        <Card.Footer>
          <Button type="submit" color="green" className="!py-1.5">
            Change Password
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
};

export default SettingChangePassword;
