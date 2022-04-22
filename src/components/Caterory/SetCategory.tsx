import { observer } from "mobx-react-lite";
import { FC, FormEvent } from "react";
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
import useForm from "../../hooks/useForm";
import useCheckForm from "../../hooks/useCheckForm";

interface SetCategoryProps {
  isOpen: boolean;
  close: () => void;
  category?: TCategory;
  categoryType: TCategoryType;
}

const SetCategory: FC<SetCategoryProps> = observer(
  ({ isOpen, close, category, categoryType }) => {
    const [form, setForm, updateForm] = useForm({
      name: "",
    });
    const [checkForm, setCheckForm, updateCheckForm] = useCheckForm({
      is_hide: false,
      is_archive: false,
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!form.name) return;

      const categoryData = {
        name: form.name,
        is_hide: checkForm.is_hide,
        is_archive: checkForm.is_archive,
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

    const onEnter = () => {
      updateForm({ name: category?.name || "" });
      updateCheckForm({
        is_hide: category?.is_hide || false,
        is_archive: category?.is_archive || false,
      });
    };

    return (
      <Modal
        isOpen={isOpen}
        close={close}
        onEnter={onEnter}
        onSubmit={onSubmit}
      >
        <ModalHeader close={close}>
          {category ? "Edit Category" : "Create Category"}
        </ModalHeader>
        <ModalContent>
          <FormField
            label="Name"
            name="name"
            value={form.name}
            onChange={setForm}
          />

          {category && (
            <>
              <Checkbox
                checked={checkForm.is_hide}
                onChange={setCheckForm}
                name="is_hide"
              >
                Hide
              </Checkbox>
              <Checkbox
                checked={checkForm.is_archive}
                onChange={setCheckForm}
                name="is_archive"
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
