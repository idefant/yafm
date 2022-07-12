import { FC, useState } from "react";
import classNames from "classnames";
import FocusTrap from "focus-trap-react";
import { useNavigate, NavLink } from "react-router-dom";
import Swal from "sweetalert2";

import { ArchiveIcon, LockIcon, ShieldIcon, UploadIcon } from "../assets/svg";
import { aesEncrypt } from "../helper/crypto";
import { createVersionRequest } from "../helper/requests/versionRequests";
import { getSyncData } from "../helper/sync";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
  clearAppDate,
  setArchiveMode,
  setIsUnsaved,
  setSafeMode,
} from "../store/reducers/appSlice";
import { clearCategories } from "../store/reducers/categorySlice";
import { clearCurrencyData } from "../store/reducers/currencySlice";
import { clearAccounts } from "../store/reducers/accountSlice";
import { clearAesPass } from "../store/reducers/userSlice";
import Hamburger from "./Hamburger";
import { clearTransactions } from "../store/reducers/transactionSlice";

const Header: FC = () => {
  const navigate = useNavigate();

  const {
    user: { api, aesPass },
    app: { safeMode, archiveMode, isUnsaved },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const sync = async () => {
    if (!api || !aesPass) return;

    const data = aesEncrypt(JSON.stringify(getSyncData()), aesPass);

    const response = await createVersionRequest(
      data.iv,
      data.hmac,
      data.cipher,
      api
    );
    if (!response) return;

    dispatch(setIsUnsaved(false));
    Swal.fire({ title: "Synchronization is successful", icon: "success" });
  };

  const lock = () => {
    dispatch(clearAesPass());
    dispatch(clearAccounts());
    dispatch(clearTransactions());
    dispatch(clearCategories());
    dispatch(clearAppDate());
    dispatch(clearCurrencyData());
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
        dispatch(setSafeMode(false));
      }
    });
  };

  const enableSafeMode = () => {
    dispatch(setSafeMode(true));
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
            <HeaderIconButton
              onClick={safeMode ? disableSafeMode : enableSafeMode}
              className={classNames(safeMode && "opacity-40")}
            >
              <ShieldIcon />
            </HeaderIconButton>

            <HeaderIconButton
              onClick={() => dispatch(setArchiveMode(!archiveMode))}
              className={classNames(!archiveMode && "opacity-40")}
            >
              <ArchiveIcon />
            </HeaderIconButton>

            <HeaderIconButton
              onClick={sync}
              className={classNames(!isUnsaved && "opacity-40")}
            >
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
};

const HeaderIconButton: FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  ...props
}) => {
  return (
    <button
      className={classNames("block text-sm px-3 py-1.5 text-white", className)}
      {...props}
    ></button>
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
