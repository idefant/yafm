import { useState } from "react";

type TFields = {
  [key: string]: string;
};

const useForm = (
  initialFields: TFields
): [TFields, (event: React.ChangeEvent<HTMLInputElement>) => void] => {
  const [fields, setField] = useState(initialFields);

  const setValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name in fields) {
      setField({ ...fields, [e.target.name]: e.target.value });
    }
  };
  return [fields, setValue];
};

export default useForm;
