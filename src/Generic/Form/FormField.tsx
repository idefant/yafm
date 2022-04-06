import { FC, HTMLInputTypeAttribute } from "react";

interface FormFieldProps {
  label: string;
  value: string;
  onChange?: any;
  units?: string;
  type?: HTMLInputTypeAttribute;
}

const FormField: FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  units,
  type = "text",
}) => {
  return (
    <div className="flex items-center my-2 gap-3">
      <label className="block w-1/3">{label}</label>
      <div className="w-2/3 flex gap-4 items-center">
        <input
          type={type}
          className="flex-1 bg-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:bg-gray-100 border focus:border-gray-600"
          value={value}
          onChange={onChange}
        />
        {units && <div>{units}</div>}
      </div>
    </div>
  );
};

export default FormField;
