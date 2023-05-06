import { useFormik } from 'formik';
import { FC } from 'react';
import { boolean, object, string } from 'yup';

import { useAppDispatch } from '../../hooks/reduxHooks';
import { setIsUnsaved } from '../../store/reducers/appSlice';
import { createCategory, editCategory } from '../../store/reducers/categorySlice';
import { TCategory, TCategoryType } from '../../types/categoryType';
import Button from '../../UI/Button';
import Checkbox from '../../UI/Form/Checkbox';
import FormField from '../../UI/Form/FormField';
import Modal from '../../UI/Modal';

interface SetCategoryProps {
  isOpen: boolean;
  close: () => void;
  category?: TCategory;
  categoryType: TCategoryType;
}

const SetCategory: FC<SetCategoryProps> = ({ isOpen, close, category, categoryType }) => {
  type TForm = { name: string; isHide: boolean; isArchive: boolean };

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

  const formik = useFormik({
    initialValues: {
      name: '',
      isHide: false,
      isArchive: false,
    },
    onSubmit,
    validationSchema: object({
      name: string().required(),
      isHide: boolean(),
      isArchive: boolean(),
    }),
    validateOnChange: false,
    validateOnBlur: true,
  });

  const onEnter = () => {
    formik.setValues({
      name: category?.name || '',
      isArchive: category?.is_archive || false,
      isHide: category?.is_hide || false,
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
      <Modal.Header close={close}>{category ? 'Edit Category' : 'Create Category'}</Modal.Header>
      <Modal.Content>
        <FormField
          label="Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={() => formik.validateField('name')}
          withError={Boolean(formik.errors.name)}
        />

        {category && (
          <>
            <Checkbox checked={formik.values.isHide} onChange={formik.handleChange} name="isHide">
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

export default SetCategory;
