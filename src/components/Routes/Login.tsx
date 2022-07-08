import { useFormik } from "formik";
import { FC } from "react";
import { object, string } from "yup";

import { loginRequest } from "../../helper/requests/userRequests";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { login } from "../../store/reducers/userSlice";
import Button from "../Generic/Button/Button";
import FormField from "../Generic/Form/FormField";

const Login: FC = () => {
  type TForm = {
    serverUrl: string;
    username: string;
    password: string;
  };

  const dispatch = useAppDispatch();

  const submitForm = async (values: TForm) => {
    const response = await loginRequest(
      values.serverUrl,
      values.username,
      values.password
    );
    if (!response) return;

    dispatch(
      login({
        url: values.serverUrl,
        username: values.username,
        refreshToken: response.data.refresh_token,
        accessToken: response.data.access_token,
      })
    );
  };

  const formik = useFormik({
    initialValues: {
      serverUrl: "",
      username: "",
      password: "",
    },
    onSubmit: submitForm,
    validationSchema: object({
      serverUrl: string().required(),
      username: string().required(),
      password: string().required(),
    }),
    validateOnChange: false,
    validateOnBlur: true,
  });

  return (
    <>
      <h1 className="text-3xl font-bold underline text-center mb-7">Login</h1>
      <form onSubmit={formik.handleSubmit}>
        <FormField
          label="Server URL"
          value={formik.values.serverUrl}
          name="serverUrl"
          onChange={formik.handleChange}
          onBlur={() => formik.validateField("serverUrl")}
          withError={Boolean(formik.errors.serverUrl)}
        />
        <FormField
          label="Username"
          value={formik.values.username}
          name="username"
          onChange={formik.handleChange}
          onBlur={() => formik.validateField("username")}
          withError={Boolean(formik.errors.username)}
        />
        <FormField
          label="Password"
          value={formik.values.password}
          type="password"
          name="password"
          onChange={formik.handleChange}
          onBlur={() => formik.validateField("password")}
          withError={Boolean(formik.errors.password)}
        />
        <Button type="submit" color="green" className="mx-auto block mt-8">
          Login
        </Button>
      </form>
    </>
  );
};

export default Login;
