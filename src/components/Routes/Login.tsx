import { observer } from "mobx-react-lite";
import { FC, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { refreshToken } from "../../helper/jwt";
import { loginRequest } from "../../helper/requests/userRequests";
import useForm from "../../hooks/useForm";
import store from "../../store";
import Button from "../Generic/Button/Button";
import FormField from "../Generic/Form/FormField";

const Login: FC = observer(() => {
  const { api, accessToken } = store.user;
  const navigate = useNavigate();

  const [form, setForm] = useForm({
    server_url: "",
    username: "",
    password: "",
  });

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const serverResponse = await loginRequest(
      form.server_url,
      form.username,
      form.password,
      window.navigator.userAgent
    );
    if (!serverResponse) return;

    store.user.login(
      form.server_url,
      form.username,
      serverResponse.data.refresh_token,
      serverResponse.data.access_token
    );
  };

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
      <form onSubmit={submitForm}>
        <FormField
          label="Server URL"
          value={form.server_url}
          name="server_url"
          onChange={setForm}
        />
        <FormField
          label="Username"
          value={form.username}
          name="username"
          onChange={setForm}
        />
        <FormField
          label="Password"
          value={form.password}
          type="password"
          name="password"
          onChange={setForm}
        />
        <Button type="submit" color="green" className="mx-auto block mt-8">
          Login
        </Button>
      </form>
    </>
  );
});

export default Login;
