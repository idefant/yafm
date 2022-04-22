import classNames from "classnames";
import { FC } from "react";
import { Link } from "react-router-dom";
import { TButtonColor } from "../../../types/buttonType";

interface ButtonLinkProps {
  color?: TButtonColor;
  className?: string;
  to: string;
}

const ButtonLink: FC<ButtonLinkProps> = ({
  children,
  color = "white",
  className,
  to,
}) => {
  return (
    <Link
      to={to}
      className={classNames(
        color === "green" && "bg-green-500",
        color === "gray" && "bg-gray-400",
        color === "red" && "bg-red-600",
        "px-4 py-2 rounded-lg border border-gray-600 border-2 inline-block",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default ButtonLink;
