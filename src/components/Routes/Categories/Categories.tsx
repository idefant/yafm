import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import {
  ArchiveIcon,
  LockIcon,
  PencilIcon,
  TrashIcon,
} from "../../../assets/svg";
import Button from "../../Generic/Button";
import Table, { TBody, TD, TDIcon, TH, THead, TR } from "../../Generic/Table";
import store from "../../../store";
import SetCategory from "../../Caterory/SetCategory";
import { TCategory, TCategoryType } from "../../../types/categoryType";
import Swal from "sweetalert2";

interface CategoriesProps {
  categoryType: TCategoryType;
}

const Categories: FC<CategoriesProps> = observer(({ categoryType }) => {
  const categories = store.category[categoryType];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <h1 className="text-3xl font-bold underline">Account Categories!!!</h1>
      <Button color="green" onClick={() => setIsOpen(true)}>
        Create Category
      </Button>

      {categories.length ? (
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Hidden</TH>
              <TH>Archived</TH>
              <TH></TH>
              <TH></TH>
            </TR>
          </THead>
          <TBody>
            {categories
              .slice()
              .sort((a, b) => +a.is_archive - +b.is_archive)
              .map((category) => (
                <CategoryItem
                  category={category}
                  key={category.id}
                  categoryType={categoryType}
                />
              ))}
          </TBody>
        </Table>
      ) : (
        <div className="font-sans text-3xl">¯\_(ツ)_/¯</div>
      )}

      <SetCategory
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        categoryType={categoryType}
      />
    </>
  );
});

interface CategoryItemProps {
  category: TCategory;
  categoryType: TCategoryType;
}

const CategoryItem: FC<CategoryItemProps> = observer(
  ({ category, categoryType }) => {
    const {
      transaction: { transactions },
      account: { accounts },
    } = store;

    const [isOpen, setIsOpen] = useState(false);

    const checkCategoryIsUsed = () => {
      const items =
        categoryType === "transactions"
          ? transactions
          : categoryType === "accounts"
          ? accounts
          : undefined;
      if (!items) return true;

      for (const item of items) {
        if (item.category_id === category.id) return true;
      }
      return false;
    };

    const confirmDelete = () => {
      checkCategoryIsUsed()
        ? Swal.fire({
            title: "Unable to delete category",
            text: `There are ${categoryType} using this category`,
            icon: "error",
          })
        : Swal.fire({
            title: "Delete category",
            icon: "error",
            text: category.name,
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: "Delete",
          }).then((result) => {
            if (result.isConfirmed) {
              store.category.deleteCategory(category.id, categoryType);
            }
          });
    };

    return (
      <TR hide={category.is_archive}>
        <TD>{category.name}</TD>
        <TD>{category.is_hide && <LockIcon />}</TD>
        <TD>{category.is_archive && <ArchiveIcon />}</TD>
        <TDIcon>
          <button className="p-2" onClick={() => setIsOpen(true)}>
            <PencilIcon className="w-7 h-7" />
          </button>
        </TDIcon>
        <TDIcon>
          <button className="p-2" onClick={confirmDelete}>
            <TrashIcon className="w-7 h-7" />
          </button>
        </TDIcon>

        <SetCategory
          isOpen={isOpen}
          close={() => setIsOpen(false)}
          category={category}
          categoryType={categoryType}
        />
      </TR>
    );
  }
);

export default Categories;
