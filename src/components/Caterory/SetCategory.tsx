import { yupResolver } from '@hookform/resolvers/yup';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useAppDispatch } from '#hooks/reduxHooks';
import {
  accountCategoryAdded,
  accountCategoryUpdated,
} from '#store/reducers/accountCategoriesSlice';
import { setIsUnsaved } from '#store/reducers/appSlice';
import {
  transactionCategoryAdded,
  transactionCategoryUpdated,
} from '#store/reducers/transactionCategoriesSlice';
import { TCategory, TCategoryType } from '#types/categoryType';
import Button from '#ui/Button';
import Form from '#ui/Form';
import Modal from '#ui/Modal';
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

const categoryAddedDict = {
  accounts: accountCategoryAdded,
  transactions: transactionCategoryAdded,
};

const categoryUpdated = {
  accounts: accountCategoryUpdated,
  transactions: transactionCategoryUpdated,
};

const SetCategory: FC<SetCategoryProps> = ({ isOpen, close, category, categoryType }) => {
  const methods = useForm<TForm>({ resolver: yupResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const dispatch = useAppDispatch();

  const onSubmit = (values: TForm) => {
    const categoryData = {
      name: values.name,
      is_archive: values.isArchive || undefined,
    };

    if (!category) {
      dispatch(categoryAddedDict[categoryType]({ id: genId(), ...categoryData }));
    } else {
      dispatch(categoryUpdated[categoryType]({ id: category.id, changes: categoryData }));
    }
    dispatch(setIsUnsaved(true));
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
