import classNames from "classnames";
import { FC, ReactNode } from "react";

import { genRanHex } from "../../../helper/random";
import style from "./Checkbox.module.css";

interface CheckboxProps {
  checked?: boolean;
  onChange?: any;
  name?: string;
  id?: string;
  children?: ReactNode;
}

const Checkbox: FC<CheckboxProps> = ({
  children,
  checked,
  onChange,
  name,
  id = genRanHex(8),
}) => {
  return (
    <div className="form-check">
      <input
        className={classNames(
          style.checkboxInput,
          "appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
        )}
        type="checkbox"
        value=""
        id={id}
        checked={checked}
        onChange={onChange}
        name={name}
      />
      <label
        className="form-check-label inline-block text-gray-800"
        htmlFor={id}
      >
        {children}
      </label>
    </div>
  );
};

export default Checkbox;
