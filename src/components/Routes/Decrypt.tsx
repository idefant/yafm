import { decompress } from "compress-json";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import { FC, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { object, string } from "yup";

import { aesDecrypt } from "../../helper/crypto";
import {
  getLastVersionRequest,
  getVersionByIdRequest,
} from "../../helper/requests/versionRequests";
import { errorAlert } from "../../helper/sweetalert";
import { checkBaseIntegrity } from "../../helper/sync";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { setCategories } from "../../store/reducers/categorySlice";
import { setAccounts } from "../../store/reducers/accountSlice";
import { setTransactions } from "../../store/reducers/transactionSlice";
import { logoutUser, setAesPass } from "../../store/reducers/userSlice";
import { EncryptedYAFM } from "../../types/cipher";
import Button from "../Generic/Button/Button";
import FormField from "../Generic/Form/FormField";

const Decrypt: FC = () => {
  const { api, aesPass } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [cipherData, setCipherData] = useState<EncryptedYAFM>();
  const [isNew, setIsNew] = useState<boolean>();
  const { versionId } = useParams();

  useEffect(() => {
    if (api) {
      (async () => {
        const response = await (versionId
          ? getVersionByIdRequest(versionId, api)
          : getLastVersionRequest(api));
        if (!response) return;

        if (!response.data) {
          setIsNew(true);
        } else {
          setIsNew(false);
          setCipherData(response.data);
        }
      })();
    }
  }, [api, navigate, aesPass, versionId]);

  type TForm = { aesKey: string };

  const submitForm = async (values: TForm) => {
    if (isNew) {
      dispatch(setAesPass(values.aesKey));
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

        dispatch(setAesPass(values.aesKey));
        dispatch(setAccounts(data.accounts));
        dispatch(
          setTransactions({
            transactions: data.transactions,
            templates: data.templates,
          })
        );
        dispatch(setCategories(data.categories));

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
    dispatch(logoutUser());
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

        <div className="flex gap-3 mb-3">
          <div className="w-1/3">Version:</div>
          <div className="w-2/3 flex gap-x-4 gap-y-1.5 flex-wrap items-center">
            {versionId
              ? cipherData &&
                DateTime.fromISO(cipherData.created_at).toFormat(
                  "dd.MM.yyyy - HH:mm"
                )
              : "Last"}
            <Link
              to="/versions"
              className="text-sm px-2.5 py-1.5 rounded-lg bg-amber-300 inline-block"
            >
              Choose another
            </Link>
          </div>
        </div>

        <FormField
          label={isNew ? "New AES Key:" : "AES Key:"}
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
};

export default Decrypt;
