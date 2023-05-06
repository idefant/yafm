import { FC, ChangeEventHandler } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

interface TextareaProps {
  value?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  name?: string;
}

const Textarea: FC<TextareaProps> = ({ value, onChange, placeholder, name }) => (
  <TextareaAutosize
    name={name}
    minRows={1}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="resize-none w-full bg-slate-700 rounded-md px-3 py-1.5 focus:outline-none border border-slate-100/30 focus:border-slate-100/60 overflow-hidden focus:shadow focus:shadow-slate-100/50 text-slate-200 transition-shadow"
  />
);

export default Textarea;
