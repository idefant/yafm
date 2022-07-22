import { useFormik } from 'formik';
import { FC, useMemo } from 'react';
import { boolean, object, string } from 'yup';

import { compareObjByStr } from '../../helper/string';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { createAccount, editAccount } from '../../store/reducers/accountSlice';
import { setIsUnsaved } from '../../store/reducers/appSlice';
import { selectFilteredAccountCategories } from '../../store/selectors';
import { TAccount } from '../../types/accountType';
import { TCurrency } from '../../types/currencyType';
import Button from '../Generic/Button/Button';
import Checkbox from '../Generic/Form/Checkbox';
import FormField from '../Generic/Form/FormField';
import Select from '../Generic/Form/Select';
import Modal from '../Generic/Modal';

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
        }),
      );
    }
    dispatch(setIsUnsaved(true));
    close();
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      currencyCode: '',
      categoryId: '',
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

  const currencyOptGroups = useMemo(() => {
    const objGroups = currencies.reduce(
      (optGroups: { [type: string]: TSelectOption[] }, currency: TCurrency) => {
        const option = {
          value: currency.code,
          text: currency.name,
        };
        // eslint-disable-next-line no-param-reassign
        if (!(currency.type in optGroups)) optGroups[currency.type] = [];
        optGroups[currency.type].push(option);
        return optGroups;
      },
      {},
    );

    return Object.entries(objGroups).map(([label, options]) => ({ label, options }));
  }, [currencies]);

  const categoryOptions = categories
    .sort((a, b) => compareObjByStr(a, b, (e) => e.name))
    .map((category) => ({ value: category.id, text: category.name }));

  const onEnter = () => {
    formik.setValues({
      name: account?.name || '',
      currencyCode: account?.currency_code || '',
      categoryId: account?.category_id || '',
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
      <Modal.Header close={close}>
        {account ? 'Edit Account' : 'Create Account'}
      </Modal.Header>
      <Modal.Content>
        <FormField
          label="Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={() => formik.validateField('name')}
          withError={Boolean(formik.errors.name)}
        />
        {!account && (
          <div className="flex items-center my-2 gap-3">
            <label className="block w-1/3">Currency</label>
            <Select
              name="currencyCode"
              selectedValue={formik.values.currencyCode}
              optGroups={currencyOptGroups}
              onChange={formik.handleChange}
              onBlur={() => formik.validateField('currencyCode')}
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
      </Modal.Content>
      <Modal.Footer>
        <Button color="green" type="submit">
          Save
        </Button>
        <Button color="gray" onClick={close}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SetAccount;
