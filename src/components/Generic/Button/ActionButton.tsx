import classNames from "classnames";
import { FC } from "react";

import { TButtonColor } from "../../../types/buttonType";

interface ActionButtonProps {
  onClick: () => void;
  color?: TButtonColor;
  active?: boolean;
  shadow?: boolean;
}

const ActionButton: FC<ActionButtonProps> = ({
  children,
  onClick,
  color = "gray",
  active,
  shadow,
}) => {
  return (
    <button
      className={classNames(
        color === "green" && "bg-green-500",
        color === "gray" && "bg-gray-400",
        color === "red" && "bg-red-600",
        color === "yellow" && "bg-yellow-400",
        "p-2 rounded-full border border-gray-600 border-2 opacity-70",
        shadow && "shadow-[0_0_12px_1px_rgba(0,0,0,0.5)]",
        active && "!opacity-100"
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

export default ActionButton;
