import { observer } from "mobx-react-lite";
import { FC } from "react";
import Button from "../Generic/Button/Button";
import FormField from "../Generic/Form/FormField";
import Modal, {
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../Generic/Modal";
import store from "../../store";
import { TCategory, TCategoryType } from "../../types/categoryType";
import Checkbox from "../Generic/Form/Checkbox";
import { useFormik } from "formik";
import { boolean, object, string } from "yup";

interface SetCategoryProps {
  isOpen: boolean;
  close: () => void;
  category?: TCategory;
  categoryType: TCategoryType;
}

const SetCategory: FC<SetCategoryProps> = observer(
  ({ isOpen, close, category, categoryType }) => {
    type TForm = { name: string; isHide: boolean; isArchive: boolean };

    const onSubmit = (values: TForm) => {
      const categoryData = {
        name: values.name,
        is_hide: values.isHide || undefined,
        is_archive: values.isArchive || undefined,
      };

      if (!category) {
        store.category.createCategory(categoryData, categoryType);
      } else {
        store.category.editCategory(
          { ...category, ...categoryData },
          categoryType
        );
      }

      close();
    };

    const formik = useFormik({
      initialValues: {
        name: "",
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
        name: category?.name || "",
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
        <ModalHeader close={close}>
          {category ? "Edit Category" : "Create Category"}
        </ModalHeader>
        <ModalContent>
          <FormField
            label="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={() => formik.validateField("name")}
            withError={Boolean(formik.errors.name)}
          />

          {category && (
            <>
              <Checkbox
                checked={formik.values.isHide}
                onChange={formik.handleChange}
                name="isHide"
              >
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
        </ModalContent>
        <ModalFooter>
          <Button color="green" type="submit">
            Save
          </Button>
          <Button color="gray" onClick={close}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
);

export default SetCategory;
