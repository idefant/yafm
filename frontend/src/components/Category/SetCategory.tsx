import { yupResolver } from '@hookform/resolvers/yup';
import { FC, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Category, CategoryType } from '#types/categoryType';
import { Button } from '#ui/Button';
import Form from '#ui/Form';
import { Modal } from '#ui/Modal';
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
  const formId = useId();

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

  const onOpen = () => {
    reset({
      name: category?.name || '',
      isArchive: category?.is_archive || false,
    });
  };

  const onExited = () => reset();

  return (
    <Modal
      title={category ? 'Edit Category' : 'Create Category'}
      isOpen={isOpen}
      close={close}
      onOpen={onOpen}
      onExited={onExited}
    >
      <Modal.Content>
        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit(onSubmit)} id={formId}>
            <Form.Input label="Name" name="name" />

            {category && <Form.Checkbox name="isArchive">Archive</Form.Checkbox>}
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

export default SetCategory;
