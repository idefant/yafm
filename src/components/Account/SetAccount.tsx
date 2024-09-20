import { yupResolver } from '@hookform/resolvers/yup';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useCreateCommitMutation } from '#api/mainApi';
import { useAppSelector, useAppDispatch } from '#hooks/reduxHooks';
import { accountAdded, accountUpdated } from '#store/reducers/accountsSlice';
import { selectCurrencies, selectVisibleAccountCategories } from '#store/selectors';
import { TAccount } from '#types/accountType';
import Button from '#ui/Button';
import Form from '#ui/Form';
import Modal from '#ui/Modal';
import { committer } from '#utils/committer';
import yup from '#utils/form/schema';
import { groupBy } from '#utils/groupBy';
import { genId } from '#utils/random';
import { compareObjByStr } from '#utils/string';

interface SetAccountProps {
  account?: TAccount;
  isOpen: boolean;
  close: () => void;
}

type TForm = {
  name: string;
  currencyCode: string | null;
  categoryId: string | null;
  isArchive: boolean;
};

const formSchema = yup.object({
  name: yup.string().required(),
  currencyCode: yup.string().required(),
  categoryId: yup.string().nullable(),
  isArchive: yup.boolean(),
});

const SetAccount: FC<SetAccountProps> = ({ isOpen, close, account }) => {
  const currencies = useAppSelector(selectCurrencies);
  const categories = useAppSelector(selectVisibleAccountCategories);
  const dispatch = useAppDispatch();

  const [createCommit] = useCreateCommitMutation();

  const methods = useForm<TForm>({ resolver: yupResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const onSubmit = async (values: TForm) => {
    const accountData = {
      name: values.name,
      category_id: values.categoryId || undefined,
      is_archive: values.isArchive || undefined,
    };

    if (account) {
      dispatch(accountUpdated({ id: account.id, changes: accountData }));
      createCommit(
        await committer({
          method: 'update_account',
          data: { id: account.id, ...accountData },
        }).encrypt(),
      );
    } else {
      const newAccount = { id: genId(), currency_code: values.currencyCode || '', ...accountData };
      dispatch(accountAdded(newAccount));
      createCommit(await committer({ method: 'create_account', data: newAccount }).encrypt());
    }
    close();
  };

  const currencyOptGroups = Object.entries(groupBy(currencies, 'type')).map(
    ([currencyType, currencies]) => ({
      label: currencyType,
      options: currencies.map((currency) => ({ value: currency.code, label: currency.name })),
    }),
  );

  const categoryOptions = categories
    .sort((a, b) => compareObjByStr(a, b, (e) => e.name))
    .map((category) => ({ value: category.id, label: category.name }));

  const onEntering = () => {
    reset({
      name: account?.name || '',
      currencyCode: account?.currency_code || null,
      categoryId: account?.category_id || null,
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

            {account && <Form.Checkbox name="isArchive">Archive</Form.Checkbox>}
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
