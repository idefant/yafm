import classNames from 'classnames';
import React, { InputHTMLAttributes } from 'react';
import { useBoolean } from 'usehooks-ts';

import Icon from './Icon';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, error, ...props }, ref) => {
    const isVisiblePassword = useBoolean();
    const inputType = isVisiblePassword.value ? 'text' : 'password';
    const hasError = typeof error === 'string' || !!error;

    const EyeIcon = isVisiblePassword.value ? Icon.EyeOff : Icon.Eye;

    return (
      <div className="flex items-center my-3 gap-3">
        {label && <label className="block w-1/3">{label}</label>}
        <div className="w-2/3 relative">
          <input
            type={inputType}
            className={classNames(
              'w-full flex-1 bg-slate-700 rounded-md pl-3 pr-11 py-1.5 outline-none border border-slate-100/30 text-slate-200 transition-shadow',
              !hasError && 'focus:border-slate-100/60 focus:shadow focus:shadow-slate-100/50',
              hasError && 'shadow-[0_0_0_3px_#ff0000c5]',
              className,
            )}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            className="absolute right-0 top-0 py-1.5 px-2.5"
            onClick={isVisiblePassword.toggle}
            aria-label="toggle visibility"
          >
            <EyeIcon className="stroke-slate-300 w-6 h-6" />
          </button>
        </div>
      </div>
    );
  },
);

export default PasswordInput;
