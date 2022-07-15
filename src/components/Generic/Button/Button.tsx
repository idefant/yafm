import classNames from "classnames";
import { FC, ReactNode } from "react";

import { TButtonColor } from ".";

interface ButtonProps {
  color?: TButtonColor;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  children?: ReactNode;
}

const Button: FC<ButtonProps> = ({
  children,
  color = "white",
  onClick,
  type = "button",
  className,
}) => {
  return (
    <button
      className={classNames(
        color === "green" && "bg-green-500",
        color === "gray" && "bg-gray-400",
        color === "red" && "bg-red-600",
        "px-4 py-2 rounded-lg border border-gray-600 border-2",
        className
      )}
      onClick={onClick}
      type={type}
      aria-describedby="animated-dialog-heading"
    >
      {children}
    </button>
  );
};

export default Button;
