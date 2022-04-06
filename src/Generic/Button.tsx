import classNames from "classnames";
import { FC } from "react";
import { TButtonColor } from "../types/buttonType";

interface ButtonProps {
  color?: TButtonColor;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const Button: FC<ButtonProps> = ({
  children,
  color = "white",
  onClick,
  type = "button",
}) => {
  return (
    <button
      className={classNames(
        color === "green" && "bg-green-500",
        color === "gray" && "bg-gray-400",
        color === "red" && "bg-red-600",
        "px-4 py-2 rounded-lg border border-gray-600 border-2"
      )}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
