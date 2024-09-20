import { yupResolver } from '@hookform/resolvers/yup';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useCreateCommitMutation } from '#api/mainApi';
import { useAppDispatch } from '#hooks/reduxHooks';
import {
  accountCategoryAdded,
  accountCategoryUpdated,
} from '#store/reducers/accountCategoriesSlice';
import {
  transactionCategoryAdded,
  transactionCategoryUpdated,
} from '#store/reducers/transactionCategoriesSlice';
import { TCategory, TCategoryType } from '#types/categoryType';
import Button from '#ui/Button';
import Form from '#ui/Form';
import Modal from '#ui/Modal';
import { committer } from '#utils/committer';
import yup from '#utils/form/schema';
import { genId } from '#utils/random';

interface SetCategoryProps {
  isOpen: boolean;
  close: () => void;
  category?: TCategory;
  categoryType: TCategoryType;
}

type TForm = {
  name: string;
  isArchive: boolean;
};

const formSchema = yup
  .object({
    name: yup.string().required(),
    isArchive: yup.bool(),
  })
  .required();

const SetCategory: FC<SetCategoryProps> = ({ isOpen, close, category, categoryType }) => {
  const methods = useForm<TForm>({ resolver: yupResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const [createCommit] = useCreateCommitMutation();

  const dispatch = useAppDispatch();

  const onSubmit = async (values: TForm) => {
    const categoryData = {
      name: values.name,
      is_archive: values.isArchive || undefined,
    };

    if (!category) {
      const newCategory = { id: genId(), ...categoryData };
      if (categoryType === 'accounts') {
        dispatch(accountCategoryAdded(newCategory));
        createCommit(
          await committer({ method: 'create_account_category', data: newCategory }).encrypt(),
        );
      }
      if (categoryType === 'transactions') {
        dispatch(transactionCategoryAdded(newCategory));
        createCommit(
          await committer({ method: 'create_transaction_category', data: newCategory }).encrypt(),
        );
      }
    } else {
      if (categoryType === 'accounts') {
        dispatch(accountCategoryUpdated({ id: category.id, changes: categoryData }));
        createCommit(
          await committer({
            method: 'update_account_category',
            data: { id: category.id, ...categoryData },
          }).encrypt(),
        );
      }
      if (categoryType === 'transactions') {
        dispatch(transactionCategoryUpdated({ id: category.id, changes: categoryData }));
        createCommit(
          await committer({
            method: 'update_transaction_category',
            data: { id: category.id, ...categoryData },
          }).encrypt(),
        );
      }
    }
    close();
  };

  const onEnter = () => {
    reset({
      name: category?.name || '',
      isArchive: category?.is_archive || false,
    });
  };

  const onExited = () => reset();

  return (
    <Modal isOpen={isOpen} close={close} onEnter={onEnter} onExited={onExited}>
      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header close={close}>
            {category ? 'Edit Category' : 'Create Category'}
          </Modal.Header>
          <Modal.Content>
            <Form.Input label="Name" name="name" />

            {category && <Form.Checkbox name="isArchive">Archive</Form.Checkbox>}
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

export default SetCategory;
