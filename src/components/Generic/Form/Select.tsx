import classNames from "classnames";
import { FC } from "react";
import style from "./Select.module.css";

interface SelectProps {
  optgroups?: {
    label: string;
    options: {
      value?: string;
      text: string;
      disabled?: boolean;
    }[];
  }[];
  options?: {
    value?: string;
    text: string;
    disabled?: boolean;
  }[];
  selectedValue?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  className?: string;
  defaultText?: string;
  useEmpty?: boolean;
  name?: string;
}

const Select: FC<SelectProps> = ({
  optgroups,
  options,
  selectedValue,
  onChange,
  className,
  defaultText = "Choose here",
  useEmpty,
  name,
}) => {
  return (
    <select
      value={selectedValue || ""}
      className={classNames(
        "bg-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:bg-gray-100 border focus:border-gray-600 appearance-none bg-clip-padding bg-no-repeat",
        className,
        style.select
      )}
      onChange={onChange}
      name={name}
    >
      {optgroups?.map((optgroup) => (
        <optgroup label={optgroup.label} key={optgroup.label}>
          {optgroup.options?.map((option) => (
            <option
              value={option.value}
              key={option.value}
              disabled={option.disabled}
            >
              {option.text}
            </option>
          ))}
        </optgroup>
      ))}
      {(!selectedValue || useEmpty) && (
        <option disabled={!useEmpty} hidden={!useEmpty} value="">
          {defaultText}
        </option>
      )}
      {options?.map((option) => (
        <option
          value={option.value}
          key={option.value}
          disabled={option.disabled}
        >
          {option.text}
        </option>
      ))}
    </select>
  );
};

export default Select;
