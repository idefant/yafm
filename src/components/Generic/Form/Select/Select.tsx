import classNames from 'classnames';
import { FC } from 'react';
import ReactSelect from 'react-select';
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager';
import './Select.scss';

interface SelectProps {
  withError?: boolean;
}

const Select: FC<StateManagerProps & SelectProps> = ({ withError, className, ...props }) => (
  <ReactSelect
    classNamePrefix="select"
    className={classNames(className, withError && 'withError')}
    {...props}
  />
);

export default Select;
