import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { LockIcon } from "../assets/svg";
import { aesEncrypt } from "../helper/crypto";
import { createCommitRequest } from "../helper/requests/commitRequests";
import { getSyncData } from "../helper/sync";
import store from "../store";

const Header: FC = observer(() => {
  const navigate = useNavigate();
  const {
    user: { api, aesPass, accessToken },
  } = store;

  const sync = async () => {
    if (api) {
      if (!aesPass || !accessToken) return;

      const data = aesEncrypt(getSyncData(true), aesPass);

      const serverResponse = await createCommitRequest(
        data.iv,
        data.hmac,
        data.cipher,
        accessToken,
        api
      );

      if (!serverResponse) return;

      Swal.fire({ title: "Synchronization is successful", icon: "success" });
    }
  };

  const lock = () => {
    store.user.clearAesPass();
    store.account.clearAccounts();
    store.category.clearCategories();
    store.transaction.clearData();
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
        <HeaderItem href="/templates">Templates</HeaderItem>
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
