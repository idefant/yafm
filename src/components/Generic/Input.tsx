import classNames from 'classnames';
import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, className, error, ...props }, ref) => (
    <input
      className={classNames(
        'w-full flex-1 bg-slate-700 rounded-md px-3 py-1.5 focus:outline-none border border-slate-100/30 focus:border-slate-100/60 focus:shadow focus:shadow-slate-100/50 text-slate-200 transition-shadow',
        className,
        (typeof error === 'string' || error) && 'shadow-[0_0_0_3px_#ff0000c5]',
      )}
      ref={ref}
      {...props}
    />
  ),
);

export default Input;
