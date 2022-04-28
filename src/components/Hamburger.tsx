import classNames from "classnames";
import { FC } from "react";
import "./Hamburger.css";

interface HamburgerProps {
  isOpen: boolean;
  toggle: () => void;
  className?: string;
}

const Hamburger: FC<HamburgerProps> = ({ isOpen, toggle, className }) => {
  return (
    <button
      className={classNames("hamburger", isOpen && "open", className)}
      onClick={toggle}
    >
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
};

export default Hamburger;
