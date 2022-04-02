import { FC } from "react";

interface SelectProps {
  options: {
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
      {!selectedValue && (
        <option disabled hidden value="">
          {defaultText}
        </option>
      )}
      {options.map((option) => (
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
