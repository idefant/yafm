import { FC, FormHTMLAttributes } from 'react';

import FormCheckbox from './FormCheckbox';
import FormInput from './FormInput';
import FormNumber from './FormNumber';
import FormPassword from './FormPassword';
import FormSelect from './FormSelect';
import FormTextarea from './FormTextarea';

interface TFormExtensions {
  Input: typeof FormInput;
  Password: typeof FormPassword;
  Checkbox: typeof FormCheckbox;
  Select: typeof FormSelect;
  Number: typeof FormNumber;
  Textarea: typeof FormTextarea;
}

const Form: FC<FormHTMLAttributes<HTMLFormElement>> & TFormExtensions = (props) => (
  <form {...props} />
);

Form.Input = FormInput;
Form.Password = FormPassword;
Form.Checkbox = FormCheckbox;
Form.Select = FormSelect;
Form.Number = FormNumber;
Form.Textarea = FormTextarea;

export default Form;
