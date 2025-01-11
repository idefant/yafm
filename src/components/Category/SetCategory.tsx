import { yupResolver } from '@hookform/resolvers/yup';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Category, CategoryType } from '#types/categoryType';
import Button from '#ui/Button';
import Form from '#ui/Form';
import Modal from '#ui/Modal';
import { actionCreator, committer } from '#utils/committer';
import yup from '#utils/form/schema';

interface SetCategoryProps {
  isOpen: boolean;
  close: () => void;
  category?: Category;
  categoryType: CategoryType;
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

  const onSubmit = async (values: TForm) => {
    const categoryData = {
      name: values.name,
      is_archive: values.isArchive || undefined,
    };

    if (!category) {
      if (categoryType === 'accounts') {
        committer(actionCreator.createAccountCategory(categoryData)).sync();
      }
      if (categoryType === 'transactions') {
        committer(actionCreator.createTransactionCategory(categoryData)).sync();
      }
    } else {
      if (categoryType === 'accounts') {
        committer(actionCreator.updateAccountCategory(category.id, categoryData)).sync();
      }
      if (categoryType === 'transactions') {
        committer(actionCreator.updateTransactionCategory(category.id, categoryData)).sync();
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
