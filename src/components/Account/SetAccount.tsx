import { yupResolver } from '@hookform/resolvers/yup';
import { FC, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { createAccount, editAccount } from '../../store/reducers/accountSlice';
import { setIsUnsaved } from '../../store/reducers/appSlice';
import { selectFilteredAccountCategories } from '../../store/selectors';
import { TAccount } from '../../types/accountType';
import { TCurrency } from '../../types/currencyType';
import Button from '../../UI/Button';
import Form from '../../UI/Form';
import Modal from '../../UI/Modal';
import { TSelectOption } from '../../UI/Select';
import yup from '../../utils/form/schema';
import { compareObjByStr } from '../../utils/string';

interface SetAccountProps {
  account?: TAccount;
  isOpen: boolean;
  close: () => void;
}

type TForm = {
  name: string;
  currencyCode: string | null;
  categoryId: string | null;
  isHide: boolean;
  isArchive: boolean;
};

const formSchema = yup.object({
  name: yup.string().required(),
  currencyCode: yup.string().required(),
  categoryId: yup.string().nullable(),
  isHide: yup.boolean(),
  isArchive: yup.boolean(),
});

const SetAccount: FC<SetAccountProps> = ({ isOpen, close, account }) => {
  const { currencies } = useAppSelector((state) => state.currency);
  const categories = useAppSelector(selectFilteredAccountCategories);
  const dispatch = useAppDispatch();

  const methods = useForm<TForm>({ resolver: yupResolver(formSchema) });
  const { handleSubmit, reset } = methods;

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
          currency_code: values.currencyCode || '',
        }),
      );
    }
    dispatch(setIsUnsaved(true));
    close();
  };

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

  const onEntering = () => {
    reset({
      name: account?.name || '',
      currencyCode: account?.currency_code || null,
      categoryId: account?.category_id || null,
      isHide: account?.is_hide || false,
      isArchive: account?.is_archive || false,
    });
  };

  const onExited = () => reset();

  return (
    <Modal isOpen={isOpen} close={close} onEntering={onEntering} onExited={onExited}>
      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header close={close}>{account ? 'Edit Account' : 'Create Account'}</Modal.Header>
          <Modal.Content>
            <Form.Input label="Name" name="name" />
            {!account && (
              <div className="flex items-center my-3 gap-3">
                <label className="block w-1/3">Currency</label>
                <Form.Select
                  className="w-2/3"
                  placeholder="Currency"
                  options={currencyOptGroups}
                  name="currencyCode"
                />
              </div>
            )}

            <div className="flex items-center my-3 gap-3">
              <label className="block w-1/3">Category</label>
              <Form.Select
                className="w-2/3"
                placeholder="Category"
                options={categoryOptions}
                isClearable
                name="categoryId"
              />
            </div>

            {account && (
              <>
                <Form.Checkbox name="isHide">Hide</Form.Checkbox>
                <Form.Checkbox name="isArchive">Archive</Form.Checkbox>
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
      </FormProvider>
    </Modal>
  );
};

export default SetAccount;
