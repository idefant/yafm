import { observer } from "mobx-react-lite";
import { ChangeEvent, FC } from "react";
import store from "../../store";
import { exportFile, readFileContent } from "../../helper/file";
import { aesDecrypt, aesEncrypt } from "../../helper/crypto";

const Setting: FC = observer(() => {
  const { aesPass } = store.user;

  const downloadBackup = (useCipher: boolean) => {
    if (!aesPass) return;
    const data = {
      accounts: store.account.accounts,
      transactions: store.transaction.transactions,
    };
    const content = JSON.stringify(data);

    if (useCipher) {
      const aesData = aesEncrypt(content, aesPass);
      exportFile(
        JSON.stringify({
          cipher: aesData.cipher,
          iv: aesData.iv,
          hmac: aesData.hmac,
        }),
        "backup-enc.yafm"
      );
    } else {
      exportFile(content, "backup-decr.yafm");
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

  return (
    <>
      <h1 className="text-3xl font-bold underline">Setting!!!</h1>

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
