import { FC } from "react";
import { Link } from "react-router-dom";

const Header: FC = () => {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-amber-600 px-6 py-4 gap-10">
      <div className="text-white text-xl font-bold">YAFM</div>
      <div className="flex-grow flex items-center w-auto gap-4">
        <HeaderItem href="/">Main</HeaderItem>
        <HeaderItem href="/transactions">Transactions</HeaderItem>
        <HeaderItem href="/accounts">Accounts</HeaderItem>
        <HeaderItem href="/categories">Categories</HeaderItem>
      </div>
      <button className="block text-sm px-4 py-2 leading-none border rounded text-white border-white">
        Open
      </button>
    </nav>
  );
};

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
