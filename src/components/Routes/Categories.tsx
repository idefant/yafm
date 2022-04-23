import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import { ArchiveIcon, LockIcon, PencilIcon, TrashIcon } from "../../assets/svg";
import Button from "../Generic/Button/Button";
import Table, { TBody, TD, TDIcon, TH, THead, TR } from "../Generic/Table";
import store from "../../store";
import SetCategory from "../Caterory/SetCategory";
import { TCategory, TCategoryType } from "../../types/categoryType";
import Swal from "sweetalert2";

interface CategoriesProps {
  categoryType: TCategoryType;
}

const Categories: FC<CategoriesProps> = observer(({ categoryType }) => {
  const categories = store.category[categoryType];
  const [isOpen, setIsOpen] = useState(false);
  const [openedCategory, setOpenedCategory] = useState<TCategory>();

  const openCategory = (category?: TCategory) => {
    setOpenedCategory(category);
    setIsOpen(true);
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline">
        {categoryType === "accounts" ? "Account" : "Transaction"} Categories!!!
      </h1>
      <Button color="green" onClick={() => openCategory()}>
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
                  openModal={() => openCategory(category)}
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
        category={openedCategory}
      />
    </>
  );
});

interface CategoryItemProps {
  category: TCategory;
  categoryType: TCategoryType;
  openModal: () => void;
}

const CategoryItem: FC<CategoryItemProps> = observer(
  ({ category, categoryType, openModal }) => {
    const {
      transaction: { transactions, templates },
      account: { accounts },
    } = store;

    const checkCategoryIsUsed = () => {
      if (categoryType === "transactions") {
        for (const transaction of transactions) {
          if (transaction.category_id === category.id) return true;
        }
        for (const template of templates) {
          if (template.category_id === category.id) return true;
        }
      }

      if (categoryType === "accounts") {
        for (const account of accounts) {
          if (account.category_id === category.id) return true;
        }
      }
      return false;
    };

    const confirmDelete = () => {
      checkCategoryIsUsed()
        ? Swal.fire({
            title: "Unable to delete category",
            text: `There are ${categoryType} or templates using this category`,
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
          <button className="p-2" onClick={openModal}>
            <PencilIcon className="w-7 h-7" />
          </button>
        </TDIcon>
        <TDIcon>
          <button className="p-2" onClick={confirmDelete}>
            <TrashIcon className="w-7 h-7" />
          </button>
        </TDIcon>
      </TR>
    );
  }
);

export default Categories;
