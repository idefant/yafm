import { useFormik } from "formik";
import dayjs from "dayjs";
import { ChangeEvent, FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bool, mixed, object, string, ValidationError } from "yup";

import { aesDecrypt } from "../../helper/crypto";
import { errorAlert } from "../../helper/sweetalert";
import { checkBaseIntegrity } from "../../helper/sync";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { setCategories } from "../../store/reducers/categorySlice";
import { setAccounts } from "../../store/reducers/accountSlice";
import { setTransactions } from "../../store/reducers/transactionSlice";
import { logoutUser, setAesPass } from "../../store/reducers/userSlice";
import Button from "../Generic/Button/Button";
import FormField from "../Generic/Form/FormField";
import { readFileContent } from "../../helper/file";
import { setIsUnsaved } from "../../store/reducers/appSlice";
import { TCipher } from "../../types/cipher";

const Upload: FC = () => {
  const { api } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [fileData, setFileData] = useState<
    { created_at: string } & (
      | { data: TCipher; is_encrypted: true }
      | { data: any; is_encrypted: false }
    )
  >();

  type TForm = { aesKey: string };

  const getPlainData = (values: TForm) => {
    if (!fileData) return;

    if (!fileData.is_encrypted) return fileData.data;

    const plaintext = aesDecrypt(
      fileData.data.cipher,
      values.aesKey,
      fileData.data.iv,
      fileData.data.hmac
    );
    if (!plaintext) {
      errorAlert({ title: "Wrong password" });
      return;
    }

    return JSON.parse(plaintext);
  };

  const submitForm = async (values: TForm) => {
    const data = getPlainData(values);
    if (!data) return;

    const validatedStatus = await checkBaseIntegrity(data);
    if (validatedStatus) {
      errorAlert({
        title: "Validate Error",
        text: validatedStatus.error,
      });
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
    dispatch(setIsUnsaved(true));
    navigate("/");
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

  const uploadBackup = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    if ("files" in input && input.files?.length && input.files?.length > 0) {
      readFileContent(input.files[0])
        .then(async (content) => {
          if (typeof content !== "string") {
            errorAlert({ title: "Wrong Format" });
            return;
          }

          const data = JSON.parse(content);
          const schema = object().shape({
            created_at: string().required(),
            is_encrypted: bool().required(),
            data: mixed().required(),
          });

          const error = await schema
            .validate(data)
            .then(() => undefined)
            .catch((err: ValidationError) => err.message);

          if (error) {
            errorAlert({ title: "File Opening Error", text: error });
            return;
          }

          setFileData(data);
        })
        .catch(() => {
          errorAlert({ title: "File Opening Error" });
        });
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline text-center mb-7">
        Upload Base
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
          <div className="w-1/3">Base:</div>
          <div className="w-2/3 flex gap-x-4 gap-y-1.5 flex-wrap items-center">
            <div>
              <input
                type="file"
                id="upload-enc-backup"
                className="hidden"
                onChange={uploadBackup}
              />
              <label
                className="block text-sm px-4 py-2 leading-none border rounded w-fit bg-green-500"
                htmlFor="upload-enc-backup"
              >
                Upload Base
              </label>
            </div>
          </div>
        </div>

        {fileData && (
          <>
            <div className="flex gap-3 mb-3">
              <div className="w-1/3">Created at:</div>
              <div className="w-2/3">
                {dayjs(fileData.created_at).format("DD.MM.YYYY (HH:mm)")}
              </div>
            </div>

            <div className="flex gap-3 mb-3">
              <div className="w-1/3">Properties:</div>
              <div className="w-2/3">
                {fileData.is_encrypted ? "Encrypted" : "Plaintext"}
              </div>
            </div>

            <FormField
              label={fileData.is_encrypted ? "AES Key:" : "New AES Key"}
              value={formik.values.aesKey}
              name="aesKey"
              onChange={formik.handleChange}
              type="password"
              onBlur={() => formik.validateField("aesKey")}
              withError={Boolean(formik.errors.aesKey)}
            />
          </>
        )}

        <div className="mx-auto mt-8 flex justify-center gap-6">
          <Button type="submit" color="green" className="block">
            Open
          </Button>
          <Button type="button" color="red" className="block" onClick={logout}>
            Logout
          </Button>
        </div>
      </form>
    </>
  );
};

export default Upload;
