import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockIcon } from "../assets/svg";
import { aesEncrypt } from "../helper/crypto";
import { createCommitRequest } from "../helper/requests/commitRequests";
import store from "../store";

const Header: FC = observer(() => {
  const navigate = useNavigate();
  const {
    user: { api, aesPass, accessToken },
  } = store;

  const prepareData = () => {
    if (!aesPass) return;

    const data = {
      accounts: store.account.accounts,
      transactions: store.transaction.transactions,
    };
    const content = JSON.stringify(data);
    const aesData = aesEncrypt(content, aesPass);
    return {
      cipher: aesData.cipher,
      iv: aesData.iv,
      hmac: aesData.hmac,
    };
  };

  const sync = async () => {
    if (api) {
      const data = prepareData();
      if (!data || !accessToken) return;

      const serverResponse = await createCommitRequest(
        data.iv,
        data.hmac,
        data.cipher,
        accessToken,
        api
      );
      if (!serverResponse) return;
    }
  };

  const lock = () => {
    store.user.clearAesPass();
    navigate("/decrypt");
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
          onClick={sync}
        >
          Sync
        </button>

        <button className="p-1" onClick={lock}>
          <LockIcon />
        </button>
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
