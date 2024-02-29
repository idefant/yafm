import classNames from 'classnames';
import React, { InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | boolean;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, className, error, ...props }, ref) => {
    const hasError = typeof error === 'string' || !!error;

    return (
      <div className="flex items-center my-3 gap-3">
        {label && <label className="block w-1/3">{label}</label>}
        <div className="flex-1">
          <input
            className={classNames(
              'w-full flex-1 bg-slate-700 rounded-md px-3 py-1.5 outline-none border border-slate-100/30 text-slate-200 transition-shadow',
              !hasError && 'focus:border-slate-100/60 focus:shadow focus:shadow-slate-100/50',
              hasError && 'shadow-[0_0_0_3px_#ff0000c5]',
              className,
            )}
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  },
);

export default TextInput;
