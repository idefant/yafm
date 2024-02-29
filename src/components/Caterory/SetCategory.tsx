import { yupResolver } from '@hookform/resolvers/yup';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useAppDispatch } from '#hooks/reduxHooks';
import { setIsUnsaved } from '#store/reducers/appSlice';
import { createCategory, editCategory } from '#store/reducers/categorySlice';
import { TCategory, TCategoryType } from '#types/categoryType';
import Button from '#ui/Button';
import Form from '#ui/Form';
import Modal from '#ui/Modal';
import yup from '#utils/form/schema';

interface SetCategoryProps {
  isOpen: boolean;
  close: () => void;
  category?: TCategory;
  categoryType: TCategoryType;
}

type TForm = {
  name: string;
  isHide: boolean;
  isArchive: boolean;
};

const formSchema = yup
  .object({
    name: yup.string().required(),
    isHide: yup.bool(),
    isArchive: yup.bool(),
  })
  .required();

const SetCategory: FC<SetCategoryProps> = ({ isOpen, close, category, categoryType }) => {
  const methods = useForm<TForm>({ resolver: yupResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const dispatch = useAppDispatch();

  const onSubmit = (values: TForm) => {
    const categoryData = {
      name: values.name,
      is_hide: values.isHide || undefined,
      is_archive: values.isArchive || undefined,
    };

    if (!category) {
      dispatch(createCategory({ category: categoryData, categoryType }));
    } else {
      dispatch(
        editCategory({
          updatedCategory: { ...category, ...categoryData },
          categoryType,
        }),
      );
    }
    dispatch(setIsUnsaved(true));
    close();
  };

  const onEnter = () => {
    reset({
      name: category?.name || '',
      isArchive: category?.is_archive || false,
      isHide: category?.is_hide || false,
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

            {category && (
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

export default SetCategory;
