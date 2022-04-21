import { useState } from "react";

type TCheckFields = {
  [key: string]: boolean;
};

const useCheckForm = (
  initialFields: TCheckFields
): [
  TCheckFields,
  (event: React.ChangeEvent<HTMLInputElement>) => void,
  (fields: TCheckFields) => void
] => {
  const [fields, setField] = useState(initialFields);

  const setValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name in fields) {
      setField({ ...fields, [e.target.name]: e.target.checked });
    }
  };

  const updateValue = (fields: TCheckFields) => setField(fields);

  return [fields, setValue, updateValue];
};

export default useCheckForm;
