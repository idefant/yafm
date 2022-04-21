import { FC } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface TextareaProps {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  name?: string;
}

const Textarea: FC<TextareaProps> = ({
  value,
  onChange,
  placeholder,
  name,
}) => {
  return (
    <TextareaAutosize
      name={name}
      minRows={1}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="resize-none w-full bg-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:bg-gray-100 border focus:border-gray-600 overflow-hidden"
    />
  );
};

export default Textarea;
