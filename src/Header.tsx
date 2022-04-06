import { HmacSHA256 } from "crypto-js";
import { observer } from "mobx-react-lite";
import { ChangeEvent, FC } from "react";
import { Link } from "react-router-dom";
import { aesDecrypt, aesEncrypt } from "./helper/crypto";
import { exportFile, readFileContent } from "./helper/file";
import store from "./store";

const Header: FC = observer(() => {
  const { tg, password } = store.setting;

  const downloadBackup = () => {
    if (!password) {
      alert("Password is not set up yet");
      return;
    }
    const data = {
      accounts: store.account.accounts,
      transactions: store.transaction.transactions,
    };
    const content = JSON.stringify(data);
    const aesData = aesEncrypt(content, password);
    const hmac = HmacSHA256(content, password).toString();
    exportFile(
      JSON.stringify({ cipher: aesData.cipher, iv: aesData.iv, hmac }),
      "backup.yafm"
    );
  };

  const uploadBackup = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    if ("files" in input && input.files?.length && input.files?.length > 0) {
      readFileContent(input.files[0])
        .then((content) => {
          if (typeof content === "string") {
            const cipherData = JSON.parse(content);

            const plaintext = aesDecrypt(
              cipherData.cipher,
              password,
              cipherData.iv
            );
            const hmac = HmacSHA256(plaintext, password).toString();
            if (cipherData.hmac !== hmac) {
              alert("Wrong password");
              return;
            }
            const data = JSON.parse(plaintext);

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

  const sendBackupToTelegram = () => {
    if (!tg.botToken || !tg.chatId) {
      alert("Telegram is not set up yet");
      return;
    }

    const data = {
      accounts: store.account.accounts,
      transactions: store.transaction.transactions,
    };
    const content = JSON.stringify(data);
    const aesData = aesEncrypt(content, password);
    const hmac = HmacSHA256(content, password).toString();

    const blob = new Blob(
      [JSON.stringify({ cipher: aesData.cipher, iv: aesData.iv, hmac })],
      { type: "plain/text" }
    );
    const formData = new FormData();
    formData.append("chat_id", tg.chatId);
    formData.append("document", blob, "backup.yafm");

    const request = new XMLHttpRequest();
    request.open(
      "POST",
      `https://api.telegram.org/bot${tg.botToken}/sendDocument`
    );
    request.send(formData);
  };

  return (
    <nav className="flex items-center justify-between flex-wrap bg-amber-600 px-6 py-4 gap-10">
      <div className="text-white text-xl font-bold">YAFM</div>
      <div className="flex-grow flex items-center w-auto gap-4">
        <HeaderItem href="/">Main</HeaderItem>
        <HeaderItem href="/transactions">Transactions</HeaderItem>
        <HeaderItem href="/accounts">Accounts</HeaderItem>
        <HeaderItem href="/setting">Setting</HeaderItem>
      </div>
      <div className="flex gap-3">
        <button
          className="block text-sm px-4 py-2 leading-none border rounded text-white border-white"
          onClick={sendBackupToTelegram}
        >
          SyncTG
        </button>
        <button
          className="block text-sm px-4 py-2 leading-none border rounded text-white border-white"
          onClick={downloadBackup}
        >
          Download
        </button>
        <input
          type="file"
          id="upload-backup"
          className="hidden"
          onChange={uploadBackup}
        />
        <label
          className="block text-sm px-4 py-2 leading-none border rounded text-white border-white"
          htmlFor="upload-backup"
        >
          Upload
        </label>
      </div>
    </nav>
  );
});

interface HeaderItemProps {
  href: string;
}

const HeaderItem: FC<HeaderItemProps> = ({ children, href }) => {
  return (
    <Link
      to={href}
      className="block lg:inline-block text-teal-lighter hover:text-white"
    >
      {children}
    </Link>
  );
};

export default Header;
