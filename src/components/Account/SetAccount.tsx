import { FC } from "react";
import { useFormik } from "formik";
import { boolean, object, string } from "yup";

import Button from "../Generic/Button/Button";
import FormField from "../Generic/Form/FormField";
import Select from "../Generic/Form/Select";
import Modal, {
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../Generic/Modal";
import { TAccount } from "../../types/accountType";
import { TCurrency } from "../../types/currencyType";
import Checkbox from "../Generic/Form/Checkbox";
import { compareObjByStr } from "../../helper/string";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { createAccount, editAccount } from "../../store/reducers/accountSlice";
import { selectFilteredAccountCategories } from "../../store/selectors";
import { setIsUnsaved } from "../../store/reducers/appSlice";

interface SetAccountProps {
  account?: TAccount;
  isOpen: boolean;
  close: () => void;
}

const SetAccount: FC<SetAccountProps> = ({ isOpen, close, account }) => {
  type TForm = {
    name: string;
    currencyCode: string;
    categoryId: string;
    isHide: boolean;
    isArchive: boolean;
  };

  const { currencies } = useAppSelector((state) => state.currency);
  const categories = useAppSelector(selectFilteredAccountCategories);
  const dispatch = useAppDispatch();

  const onSubmit = (values: TForm) => {
    const accountData = {
      name: values.name,
      category_id: values.categoryId || undefined,
      is_hide: values.isHide || undefined,
      is_archive: values.isArchive || undefined,
    };

    if (account) {
      dispatch(editAccount({ ...account, ...accountData }));
    } else {
      dispatch(
        createAccount({
          ...accountData,
          currency_code: values.currencyCode,
        })
      );
    }
    dispatch(setIsUnsaved(true));
    close();
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      currencyCode: "",
      categoryId: "",
      isHide: false,
      isArchive: false,
    },
    onSubmit,
    validationSchema: object({
      name: string().required(),
      currencyCode: string().required(),
      categoryId: string(),
      isHide: boolean(),
      isArchive: boolean(),
    }),
    validateOnChange: false,
    validateOnBlur: true,
  });

  type TSelectOption = { value: string; text: string };
  const currencyOptions = currencies.reduce(
    (
      result: {
        optgroups: { [type: string]: TSelectOption[] };
        options: TSelectOption[];
      },
      current: TCurrency
    ) => {
      if (current.code) {
        const option = {
          value: current.code,
          text: current.name,
        };
        if (!(current.type in result.optgroups))
          result.optgroups[current.type] = [];
        result.optgroups[current.type].push(option);
        return result;
      }
      return result;
    },
    { optgroups: {}, options: [] }
  );

  const categoryOptions = categories
    .sort((a, b) => compareObjByStr(a, b, (e) => e.name))
    .map((category) => ({ value: category.id, text: category.name }));

  const optgroups = (() => {
    const optgroups = [];
    for (const key in currencyOptions.optgroups) {
      optgroups.push({ label: key, options: currencyOptions.optgroups[key] });
    }
    return optgroups;
  })();

  const onEnter = () => {
    formik.setValues({
      name: account?.name || "",
      currencyCode: account?.currency_code || "",
      categoryId: account?.category_id || "",
      isHide: account?.is_hide || false,
      isArchive: account?.is_archive || false,
    });
  };

  const onExited = () => {
    formik.resetForm();
  };

  return (
    <Modal
      isOpen={isOpen}
      close={close}
      onEnter={onEnter}
      onExited={onExited}
      onSubmit={formik.handleSubmit}
    >
      <ModalHeader close={close}>
        {account ? "Edit Account" : "Create Account"}
      </ModalHeader>
      <ModalContent>
        <FormField
          label="Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={() => formik.validateField("name")}
          withError={Boolean(formik.errors.name)}
        />
        {!account && (
          <div className="flex items-center my-2 gap-3">
            <label className="block w-1/3">Currency</label>
            <Select
              name="currencyCode"
              selectedValue={formik.values.currencyCode}
              optgroups={optgroups}
              options={currencyOptions.options}
              onChange={formik.handleChange}
              onBlur={() => formik.validateField("currencyCode")}
              withError={Boolean(formik.errors.currencyCode)}
              className="w-2/3"
            />
          </div>
        )}

        <div className="flex items-center my-2 gap-3">
          <label className="block w-1/3">Category</label>
          <Select
            name="categoryId"
            selectedValue={formik.values.categoryId}
            options={categoryOptions}
            onChange={formik.handleChange}
            className="w-2/3"
            useEmpty
            defaultText="Choose a category"
          />
        </div>

        {account && (
          <>
            <Checkbox
              checked={formik.values.isHide}
              onChange={formik.handleChange}
              name="isHide"
            >
              Hide
            </Checkbox>
            <Checkbox
              checked={formik.values.isArchive}
              onChange={formik.handleChange}
              name="isArchive"
            >
              Archive
            </Checkbox>
          </>
        )}
      </ModalContent>
      <ModalFooter>
        <Button color="green" type="submit">
          Save
        </Button>
        <Button color="gray" onClick={close}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SetAccount;
