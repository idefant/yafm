import { decompress } from "compress-json";
import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";
import { aesDecrypt } from "../../helper/crypto";
import { getLastCommitRequest } from "../../helper/requests/commitRequests";
import { errorAlert } from "../../helper/sweetalert";
import { checkBaseIntegrity } from "../../helper/sync";
import store from "../../store";
import { EncryptedYAFM } from "../../types/cipher";
import Button from "../Generic/Button/Button";
import FormField from "../Generic/Form/FormField";

const Decrypt: FC = observer(() => {
  const { api, aesPass, accessToken } = store.user;
  const navigate = useNavigate();

  const [cipherData, setCipherData] = useState<EncryptedYAFM>();
  const [isNew, setIsNew] = useState<boolean>();

  useEffect(() => {
    if (accessToken && api) {
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

  type TForm = { aesKey: string };

  const submitForm = async (values: TForm) => {
    if (isNew) {
      store.user.setAesPass(values.aesKey);
      return;
    }

    if (cipherData) {
      const plaintext = aesDecrypt(
        cipherData.cipher,
        values.aesKey,
        cipherData.iv,
        cipherData.hmac
      );
      if (plaintext) {
        const data = decompress(JSON.parse(plaintext));

        const validatedStatus = await checkBaseIntegrity(data);
        if (validatedStatus) {
          errorAlert({ title: "Validate Error", text: validatedStatus.error });
          return;
        }

        store.user.setAesPass(values.aesKey);
        store.account.setAccounts(data.accounts);
        store.transaction.setData(data.transactions, data.templates);
        store.category.setCategories(data.categories);

        navigate("/");
      } else {
        errorAlert({ title: "Wrong password" });
      }
    }
  };

  const formik = useFormik({
    initialValues: { aesKey: "" },
    onSubmit: submitForm,
    validationSchema: object({ aesKey: string().required() }),
    validateOnChange: false,
    validateOnBlur: true,
  });

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
      <form onSubmit={formik.handleSubmit}>
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
          value={formik.values.aesKey}
          name="aesKey"
          onChange={formik.handleChange}
          type="password"
          onBlur={() => formik.validateField("aesKey")}
          withError={Boolean(formik.errors.aesKey)}
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
