import { Form, Formik } from 'formik';
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

  type TSelectOption = { value: string; label: string };

  const currencyOptGroups = useMemo(() => {
    const objGroups = currencies.reduce(
      (optGroups: { [type: string]: TSelectOption[] }, currency: TCurrency) => {
        const option = {
          value: currency.code,
          label: currency.name,
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
    .map((category) => ({ value: category.id, label: category.name }));

  const initialFormValues = {
    name: account?.name || '',
    currencyCode: account?.currency_code || '',
    categoryId: account?.category_id || '',
    isHide: account?.is_hide || false,
    isArchive: account?.is_archive || false,
  };

  const validationSchema = object({
    name: string().required(),
    currencyCode: string().required(),
    categoryId: string(),
    isHide: boolean(),
    isArchive: boolean(),
  });

  return (
    <Modal
      isOpen={isOpen}
      close={close}
    >
      <Formik
        initialValues={initialFormValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur
      >
        {({
          errors, values, handleChange, validateField, setFieldValue,
        }) => (
          <Form>
            <Modal.Header close={close}>
              {account ? 'Edit Account' : 'Create Account'}
            </Modal.Header>
            <Modal.Content>
              <FormField
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={() => validateField('name')}
                withError={Boolean(errors.name)}
              />
              {!account && (
                <div className="flex items-center my-2 gap-3">
                  <label className="block w-1/3">Currency</label>
                  <Select
                    className="w-2/3"
                    placeholder="Currency"
                    options={currencyOptGroups}
                    name="currencyCode"
                    value={currencyOptGroups
                      .flatMap((group) => group.options)
                      .find((option) => (option.value === values.currencyCode))}
                    onChange={(newValue: any) => setFieldValue('currencyCode', newValue?.value)}
                    onBlur={() => validateField('currencyCode')}
                    withError={Boolean(errors.currencyCode)}
                  />
                </div>
              )}

              <div className="flex items-center my-2 gap-3">
                <label className="block w-1/3">Category</label>
                <Select
                  className="w-2/3"
                  placeholder="Category"
                  options={categoryOptions}
                  isClearable
                  name="categoryId"
                  value={categoryOptions.find((option) => (option.value === values.categoryId))}
                  onChange={(newValue: any) => setFieldValue('categoryId', newValue?.value)}
                />
              </div>

              {account && (
                <>
                  <Checkbox
                    checked={values.isHide}
                    onChange={handleChange}
                    name="isHide"
                  >
                    Hide
                  </Checkbox>
                  <Checkbox
                    checked={values.isArchive}
                    onChange={handleChange}
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
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default SetAccount;
