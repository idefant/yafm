import { FC } from "react";

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
}

const Select: FC<SelectProps> = ({
  optgroups,
  options,
  selectedValue,
  onChange,
  className,
  defaultText = "Choose here",
}) => {
  return (
    <select
      defaultValue={selectedValue || ""}
      className={className}
      onChange={onChange}
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
      {!selectedValue && (
        <option disabled hidden value="">
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
