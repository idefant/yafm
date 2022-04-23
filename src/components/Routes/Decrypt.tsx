import { observer } from "mobx-react-lite";
import { FC, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { aesDecrypt } from "../../helper/crypto";
import { getLastCommitRequest } from "../../helper/requests/commitRequests";
import { errorAlert } from "../../helper/sweetalert";
import useForm from "../../hooks/useForm";
import store from "../../store";
import { EncryptedYAFM } from "../../types/cipher";
import Button from "../Generic/Button/Button";
import FormField from "../Generic/Form/FormField";

const Decrypt: FC = observer(() => {
  const { api, aesPass, accessToken } = store.user;
  const navigate = useNavigate();

  const [form, setForm] = useForm({
    aes_key: "",
  });

  const [cipherData, setCipherData] = useState<EncryptedYAFM>();
  const [isNew, setIsNew] = useState<boolean>();

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
        if (serverResponse.data.is_new) {
          setIsNew(true);
        } else {
          setIsNew(false);
          setCipherData(serverResponse.data.data);
        }
      })();
    }
  }, [api, navigate, aesPass, accessToken]);

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.aes_key) {
      errorAlert({ title: "You need write AES Key" });
      return;
    }

    if (isNew) {
      store.user.setAesPass(form.aes_key);
      return;
    }

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
        store.transaction.setData(data.transactions, data.templates);
        store.category.setCategories(data.categories);

        navigate("/");
      } else {
        errorAlert({ title: "Wrong password" });
      }
    }
  };

  const logout = () => {
    store.user.logout();
    navigate("/login");
  };

  return isNew === undefined ? (
    <>Loading...</>
  ) : (
    <>
      <h1 className="text-3xl font-bold underline text-center mb-7">
        {isNew ? "Create Base" : "Decrypt Base"}
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
          label="New AES Key"
          value={form.aes_key}
          name="aes_key"
          onChange={setForm}
          type="password"
        />
        <div className="mx-auto mt-8 flex justify-center gap-6">
          <Button type="submit" color="green" className="block">
            {isNew ? "Create new Base" : "Decrypt"}
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
