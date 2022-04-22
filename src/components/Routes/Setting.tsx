import { observer } from "mobx-react-lite";
import { ChangeEvent, FC } from "react";
import store from "../../store";
import { exportFile, readFileContent } from "../../helper/file";
import { aesDecrypt, aesEncrypt } from "../../helper/crypto";
import FormField from "../Generic/Form/FormField";
import useForm from "../../hooks/useForm";
import Button from "../Generic/Button/Button";
import Swal from "sweetalert2";
import { getSyncData } from "../../helper/sync";

const Setting: FC = observer(() => {
  const { aesPass } = store.user;

  const downloadBackup = (useCipher: boolean) => {
    const data = getSyncData();

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
                alert("Wrong password");
                return;
              }
              data = JSON.parse(plaintext);
            } else {
              data = JSON.parse(content);
            }

            store.account.setAccounts(data.accounts);
            store.transaction.setTransactions(data.transactions);
            store.category.setCategories(data.categories);
          } else {
            alert("Wrong Format");
          }
        })
        .catch((error) => {
          alert("File Opening Error");
          console.log(error);
        });
    }
  };

  const [form, setForm] = useForm({
    old_pass: "",
    new_pass: "",
    repeat_pass: "",
  });

  const changePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.old_pass !== aesPass) {
      Swal.fire({ title: "Wrong password", icon: "error" });
      return;
    }
    if (form.new_pass !== form.repeat_pass) {
      Swal.fire({ title: "Passwords don't match", icon: "error" });
      return;
    }

    store.user.setAesPass(form.new_pass);
    Swal.fire({ title: "Password changed successfully", icon: "success" });
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline pb-4">Setting!!!</h1>

      <h2 className="text-2xl font-bold underline pb-3">Change Password</h2>

      <form className="w-2/3" onSubmit={changePassword}>
        <FormField
          label="Old password"
          value={form.old_pass}
          onChange={setForm}
          name="old_pass"
          type="password"
        />
        <FormField
          label="New password"
          value={form.new_pass}
          onChange={setForm}
          name="new_pass"
          type="password"
        />
        <FormField
          label="Repeat password"
          value={form.repeat_pass}
          onChange={setForm}
          name="repeat_pass"
          type="password"
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
    </>
  );
});

export default Setting;
