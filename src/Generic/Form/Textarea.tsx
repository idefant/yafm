import { FC } from "react";

interface TextareaProps {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
}

const Textarea: FC<TextareaProps> = ({ value, onChange, placeholder }) => {
  return (
    <textarea
      rows={value?.split("\n").length}
      onChange={onChange}
      className="resize-none w-full bg-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:bg-gray-100 border focus:border-gray-600 overflow-hidden"
      placeholder={placeholder}
      value={value}
    />
  );
};

export default Textarea;
