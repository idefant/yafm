import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";
import { refreshToken } from "../../helper/jwt";
import { loginRequest } from "../../helper/requests/userRequests";
import store from "../../store";
import Button from "../Generic/Button/Button";
import FormField from "../Generic/Form/FormField";

const Login: FC = observer(() => {
  const { api, accessToken } = store.user;
  const navigate = useNavigate();

  type TForm = {
    serverUrl: string;
    username: string;
    password: string;
  };

  const submitForm = async (values: TForm) => {
    const serverResponse = await loginRequest(
      values.serverUrl,
      values.username,
      values.password,
      window.navigator.userAgent
    );
    if (!serverResponse) return;

    store.user.login(
      values.serverUrl,
      values.username,
      serverResponse.data.refresh_token,
      serverResponse.data.access_token
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

  useEffect(() => {
    (async () => {
      if (!api) return;

      const status = await refreshToken(api, accessToken);
      if (status) {
        navigate("/decrypt");
      }
    })();
  }, [api, navigate, accessToken]);

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
});

export default Login;
