import { FC } from "react";

interface FormFieldProps {
  label: string;
  value: string;
  onChange?: any;
}

const FormField: FC<FormFieldProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center my-2 gap-3">
      <label className="block w-1/3">{label}</label>
      <input
        type="text"
        className="w-2/3 bg-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:bg-gray-100 border focus:border-gray-600"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default FormField;
