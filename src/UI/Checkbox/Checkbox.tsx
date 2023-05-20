import classNames from 'classnames';
import React, { InputHTMLAttributes, forwardRef } from 'react';

import { genRanHex } from '../../utils/random';

import style from './Checkbox.module.css';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ children, id = genRanHex(8), error, ...props }, ref) => (
    <div>
      <input
        className={classNames(
          style.checkboxInput,
          'appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer',
          error && 'border-red-400 shadow-[0_0_0_2px_#ff0000c5]',
        )}
        type="checkbox"
        id={id}
        ref={ref}
        {...props}
      />
      {children && (
        <label className="inline-block" htmlFor={id}>
          {children}
        </label>
      )}
    </div>
  ),
);

export default Checkbox;
