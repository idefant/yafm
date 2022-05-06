import classNames from "classnames";
import FocusTrap from "focus-trap-react";
import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import { LockIcon, ShieldIcon, ShieldOffIcon, UploadIcon } from "../assets/svg";
import { aesEncrypt } from "../helper/crypto";
import { createCommitRequest } from "../helper/requests/commitRequests";
import { getSyncData } from "../helper/sync";
import store from "../store";
import Hamburger from "./Hamburger";

const Header: FC = observer(() => {
  const navigate = useNavigate();
  const {
    user: { api, aesPass, accessToken },
    app: { safeMode },
  } = store;
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

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
    store.app.setSafeMode(true);
    navigate("/decrypt");
  };

  const disableSafeMode = () => {
    Swal.fire({
      title: "Show hidden data?",
      icon: "warning",
      confirmButtonText: "Yes, I'm safe",
      showCancelButton: true,
      focusCancel: true,
    }).then((res) => {
      if (res.isConfirmed) {
        store.app.setSafeMode(false);
      }
    });
  };

  const enableSafeMode = () => {
    store.app.setSafeMode(true);
    Swal.fire({
      title: "Safe mode is enabled",
      icon: "success",
      timer: 1500,
    });
  };

  return (
    <FocusTrap active={isOpen}>
      <nav className="">
        <div className="relative flex items-center justify-between flex-wrap bg-gray-800 px-6 py-4 gap-10">
          <div className="text-white text-xl font-bold">YAFM</div>
          <div className="flex-grow items-center w-auto gap-4 hidden md:flex">
            <HeaderItem href="/" title="Main" />
            <HeaderItem
              href="/transactions"
              title="Transactions"
              items={[
                { title: "Categories", href: "/transactions/categories" },
                { title: "Templates", href: "/transactions/templates" },
              ]}
            />
            <HeaderItem
              href="/accounts"
              title="Accounts"
              items={[{ title: "Categories", href: "/accounts/categories" }]}
            />
            <HeaderItem href="/setting" title="Setting" />
          </div>
          <div className="flex gap-2 md:gap-6 items-center">
            {safeMode ? (
              <HeaderIconButton onClick={disableSafeMode}>
                <ShieldIcon />
              </HeaderIconButton>
            ) : (
              <HeaderIconButton onClick={enableSafeMode}>
                <ShieldOffIcon />
              </HeaderIconButton>
            )}
            <HeaderIconButton onClick={sync}>
              <UploadIcon />
            </HeaderIconButton>

            <HeaderIconButton onClick={lock}>
              <LockIcon className="text-white" />
            </HeaderIconButton>
            <Hamburger
              isOpen={isOpen}
              toggle={toggle}
              className="block md:hidden ml-2"
            />
          </div>
        </div>

        <div
          className={classNames(
            "bg-slate-800/95 fixed inset-0 mt-[64px] px-8 py-5 overflow-y-auto",
            isOpen ? "block sm:hidden" : "hidden"
          )}
        >
          <ul>
            <MobileHeaderItem href="/" title="Main" toggle={toggle} />
            <MobileHeaderItem
              href="/transactions"
              title="Transactions"
              items={[
                { title: "Categories", href: "/transactions/categories" },
                { title: "Templates", href: "/transactions/templates" },
              ]}
              toggle={toggle}
            />
            <MobileHeaderItem
              href="/accounts"
              title="Accounts"
              items={[{ title: "Categories", href: "/accounts/categories" }]}
              toggle={toggle}
            />
            <MobileHeaderItem href="/setting" title="Setting" toggle={toggle} />
          </ul>
        </div>
      </nav>
    </FocusTrap>
  );
});

interface HeaderIconButtonProps {
  onClick: () => void;
}

const HeaderIconButton: FC<HeaderIconButtonProps> = ({ children, onClick }) => {
  return (
    <button className="block text-sm px-3 py-1.5 text-white" onClick={onClick}>
      {children}
    </button>
  );
};

interface HeaderItemProps {
  title: string;
  href: string;
  items?: {
    title: string;
    href: string;
  }[];
  toggle?: () => void;
}

const MobileHeaderItem: FC<HeaderItemProps> = ({
  title,
  href,
  items,
  toggle,
}) => {
  return (
    <li>
      <NavLink
        to={href}
        className={({ isActive }) =>
          [
            "block lg:inline-block py-2 text-xl",
            isActive ? "text-white" : "text-gray-400 hover:text-white",
          ].join(" ")
        }
        onClick={toggle}
      >
        {title}
      </NavLink>
      {items && items.length !== 0 && (
        <ul className="px-5 py-2 text-lg pt-0 pl-8">
          {items.map((item) => (
            <li className="py-1.5" key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  isActive ? "text-white" : "text-gray-400 hover:text-white"
                }
                onClick={toggle}
              >
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const HeaderItem: FC<HeaderItemProps> = ({ title, href, items }) => {
  return (
    <div className="group relative">
      <NavLink
        to={href}
        className={({ isActive }) =>
          [
            "block lg:inline-block py-2",
            isActive ? "text-white" : "text-gray-400 hover:text-white",
          ].join(" ")
        }
      >
        {title}
      </NavLink>
      {items && items.length !== 0 && (
        <ul className="hidden absolute bg-gray-700 px-5 py-2 rounded-md group-hover:block border-gray-900 border-2">
          {items.map((item) => (
            <li className="py-1.5" key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  isActive ? "text-white" : "text-gray-300 hover:text-white"
                }
              >
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Header;
