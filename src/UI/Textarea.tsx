import classNames from 'classnames';
import { ComponentProps, forwardRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

type TextareaProps = ComponentProps<typeof TextareaAutosize>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <TextareaAutosize
    minRows={1}
    className={classNames(
      'resize-none w-full bg-slate-700 rounded-md px-3 py-1.5 focus:outline-none border border-slate-100/30 focus:border-slate-100/60 overflow-hidden focus:shadow focus:shadow-slate-100/50 text-slate-200 transition-shadow',
      className,
    )}
    ref={ref}
    {...props}
  />
));

export default Textarea;
