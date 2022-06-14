import { observer } from "mobx-react-lite";
import { ChangeEvent, FC } from "react";
import store from "../../store";
import { exportFile, readFileContent } from "../../helper/file";
import { aesDecrypt, aesEncrypt } from "../../helper/crypto";
import FormField from "../Generic/Form/FormField";
import Button from "../Generic/Button/Button";
import Swal from "sweetalert2";
import { getSyncData } from "../../helper/sync";
import { decompress } from "compress-json";
import { useFormik } from "formik";
import { object, string } from "yup";
import { errorAlert } from "../../helper/sweetalert";

const Setting: FC = observer(() => {
  const { aesPass } = store.user;

  const downloadBackup = (useCipher: boolean) => {
    const data = getSyncData(useCipher);

    if (useCipher) {
      if (!aesPass) return;
      const aesData = aesEncrypt(data, aesPass);
      exportFile(
        JSON.stringify({
          cipher: aesData.cipher,
          iv: aesData.iv,
          hmac: aesData.hmac,
        }),
        "backup-enc.yafm"
      );
    } else {
      exportFile(data, "backup-decr.yafm");
    }
  };

  const uploadBackup = (
    event: ChangeEvent<HTMLInputElement>,
    isEncrypted: boolean
  ) => {
    if (!aesPass) return;

    const input = event.target;
    if ("files" in input && input.files?.length && input.files?.length > 0) {
      readFileContent(input.files[0])
        .then((content) => {
          if (typeof content === "string") {
            let data;

            if (isEncrypted) {
              const cipherData = JSON.parse(content);

              const plaintext = aesDecrypt(
                cipherData.cipher,
                aesPass,
                cipherData.iv,
                cipherData.hmac
              );
              if (!plaintext) {
                errorAlert({ title: "Wrong password" });
                return;
              }
              data = decompress(JSON.parse(plaintext));
            } else {
              data = JSON.parse(content);
            }

            store.account.setAccounts(data.accounts);
            store.transaction.setData(data.transactions, data.templates);
            store.category.setCategories(data.categories);
          } else {
            errorAlert({ title: "Wrong Format" });
          }
        })
        .catch((error) => {
          errorAlert({ title: "File Opening Error" });
        });
    }
  };

  type TForm = {
    oldPassword: string;
    newPassword: string;
    repeatPassword: string;
  };

  const changePassword = (values: TForm) => {
    if (values.oldPassword !== aesPass) {
      Swal.fire({ title: "Wrong password", icon: "error" });
      return;
    }
    if (values.newPassword !== values.repeatPassword) {
      Swal.fire({ title: "Passwords don't match", icon: "error" });
      return;
    }

    store.user.setAesPass(values.newPassword);
    Swal.fire({ title: "Password changed successfully", icon: "success" });
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      repeatPassword: "",
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

  const recalculateBalances = () => {
    const isChanged = store.account.recalculateBalances();
    Swal.fire({
      title: isChanged
        ? "Balances have been successfully recalculated"
        : "No errors found",
      icon: "success",
    });
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline pb-4">Setting!!!</h1>

      <h2 className="text-2xl font-bold underline pb-3">Change Password</h2>

      <form className="w-2/3" onSubmit={formik.handleSubmit}>
        <FormField
          label="Old password"
          value={formik.values.oldPassword}
          onChange={formik.handleChange}
          name="oldPassword"
          type="password"
          onBlur={() => formik.validateField("oldPassword")}
          withError={Boolean(formik.errors.oldPassword)}
        />
        <FormField
          label="New password"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          name="newPassword"
          type="password"
          onBlur={() => formik.validateField("newPassword")}
          withError={Boolean(formik.errors.newPassword)}
        />
        <FormField
          label="Repeat password"
          value={formik.values.repeatPassword}
          onChange={formik.handleChange}
          name="repeatPassword"
          type="password"
          onBlur={() => formik.validateField("repeatPassword")}
          withError={Boolean(formik.errors.repeatPassword)}
        />
        <Button type="submit">Change Password</Button>
      </form>

      <hr className="my-5" />

      <button
        className="block text-sm px-4 py-2 leading-none border rounded bg-blue-500"
        onClick={() => downloadBackup(true)}
      >
        Download Encrypted
      </button>
      <button
        className="block text-sm px-4 py-2 leading-none border rounded bg-red-500"
        onClick={() => downloadBackup(false)}
      >
        Download Decrypted
      </button>

      <input
        type="file"
        id="upload-enc-backup"
        className="hidden"
        onChange={(e) => uploadBackup(e, true)}
      />
      <label
        className="block text-sm px-4 py-2 leading-none border rounded w-fit bg-green-500"
        htmlFor="upload-enc-backup"
      >
        Upload Encrypted
      </label>

      <input
        type="file"
        id="upload-decr-backup"
        className="hidden"
        onChange={(e) => uploadBackup(e, false)}
      />
      <label
        className="block text-sm px-4 py-2 leading-none border rounded w-fit bg-green-500"
        htmlFor="upload-decr-backup"
      >
        Upload Decrypted
      </label>

      <Button onClick={recalculateBalances}>Recalculate</Button>
    </>
  );
});

export default Setting;
