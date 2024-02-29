import classNames from 'classnames';
import { forwardRef } from 'react';
import ReactSelect, { Props } from 'react-select';
import './Select.scss';

interface SelectProps extends Props {
  error?: string | boolean;
}

const Select = forwardRef<any, SelectProps>(({ className, error, ...props }, ref) => (
  <ReactSelect
    classNamePrefix="select"
    placeholder=""
    className={classNames(className, error && 'select_with-error')}
    ref={ref}
    {...props}
  />
));

export type TSelectOption = { value: string; label: string };

export default Select;
