import { observer } from "mobx-react-lite";
import { FC, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { aesDecrypt } from "../../helper/crypto";
import { getLastCommitRequest } from "../../helper/requests/commitRequests";
import useForm from "../../hooks/useForm";
import store from "../../store";
import { EncryptedYAFM } from "../../types/cipher";
import Button from "../Generic/Button";
import FormField from "../Generic/Form/FormField";

const Decrypt: FC = observer(() => {
  const { api, aesPass, accessToken } = store.user;
  const navigate = useNavigate();

  const [form, setForm] = useForm({
    aes_key: "",
  });

  const [cipherData, setCipherData] = useState<EncryptedYAFM>();

  useEffect(() => {
    if (!api) {
      navigate("/login");
      return;
    } else if (aesPass) {
      navigate("/");
      return;
    }

    if (accessToken) {
      (async () => {
        const serverResponse = await getLastCommitRequest(accessToken, api);
        if (!serverResponse) return;
        setCipherData(serverResponse.data.data);
      })();
    }
  }, [api, navigate, aesPass, accessToken]);

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cipherData) {
      const plaintext = aesDecrypt(
        cipherData.cipher,
        form.aes_key,
        cipherData.iv,
        cipherData.hmac
      );
      if (plaintext) {
        store.user.setAesPass(form.aes_key);
        const data = JSON.parse(plaintext);

        store.account.setAccounts(data.accounts);
        store.transaction.setTransactions(data.transactions);

        navigate("/");
      } else {
        alert("Wrong password");
      }
    }
  };

  const logout = () => {
    store.user.logout();
    navigate("/login");
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline text-center mb-7">
        Decrypt YAFM
      </h1>
      <form onSubmit={submitForm}>
        <div className="flex gap-3 mb-3">
          <div className="w-1/3">Server URL: </div>
          <div className="w-2/3">{api?.url}</div>
        </div>
        <div className="flex gap-3 mb-3">
          <div className="w-1/3">Username:</div>
          <div className="w-2/3">{api?.username}</div>
        </div>
        <FormField
          label="AES Key"
          value={form.aes_key}
          name="aes_key"
          onChange={setForm}
          type="password"
        />
        <div className="mx-auto mt-8 flex justify-center gap-6">
          <Button type="submit" color="green" className="block">
            Decrypt
          </Button>
          <Button type="button" color="red" className="block" onClick={logout}>
            Logout
          </Button>
        </div>
      </form>
    </>
  );
});

export default Decrypt;
