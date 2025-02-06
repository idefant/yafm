import { yupResolver } from '@hookform/resolvers/yup';
import { FC, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useAppSelector } from '#hooks/reduxHooks';
import { selectCurrencies, selectVisibleAccountCategories } from '#store/selectors';
import { Account } from '#types/accountType';
import { Button } from '#ui/Button';
import Form from '#ui/Form';
import { Modal } from '#ui/Modal';
import { actionCreator, committer } from '#utils/committer';
import yup from '#utils/form/schema';
import { groupBy } from '#utils/groupBy';
import { compareObjByStr } from '#utils/string';

interface SetAccountProps {
  account?: Account;
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
  const formId = useId();

  const currencies = useAppSelector(selectCurrencies);
  const categories = useAppSelector(selectVisibleAccountCategories);

  const methods = useForm<TForm>({ resolver: yupResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const onSubmit = async (values: TForm) => {
    const accountData = {
      name: values.name,
      category_id: values.categoryId || undefined,
      is_archive: values.isArchive || undefined,
    };

    if (account) {
      committer(actionCreator.updateAccount(account.id, accountData)).sync();
    } else {
      committer(
        actionCreator.createAccount({ currency_code: values.currencyCode || '', ...accountData }),
      ).sync();
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

  const onOpening = () => {
    reset({
      name: account?.name || '',
      currencyCode: account?.currency_code || null,
      categoryId: account?.category_id || null,
      isArchive: account?.is_archive || false,
    });
  };

  const onExited = () => reset();

  return (
    <Modal
      title={account ? 'Edit Account' : 'Create Account'}
      isOpen={isOpen}
      close={close}
      onOpening={onOpening}
      onExited={onExited}
    >
      <Modal.Content>
        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit(onSubmit)} id={formId}>
            <Form.Input label="Name" name="name" />
            {!account && (
              <Form.Select
                label="Currency"
                placeholder="Choose currency..."
                options={currencyOptGroups}
                name="currencyCode"
              />
            )}

            <Form.Select
              label="Category"
              placeholder="Choose category..."
              options={categoryOptions}
              isClearable
              name="categoryId"
            />

            {account && <Form.Checkbox name="isArchive">Archive</Form.Checkbox>}
          </Form>
        </FormProvider>
      </Modal.Content>

      <Modal.Footer>
        <Button color="secondary" onClick={close}>
          Cancel
        </Button>
        <Button type="submit" form={formId}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SetAccount;
