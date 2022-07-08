import { FC, useState } from "react";
import Swal from "sweetalert2";

import { ArchiveIcon, LockIcon, PencilIcon, TrashIcon } from "../../assets/svg";
import Button from "../Generic/Button/Button";
import Table, { TBody, TD, TDIcon, TH, THead, TR } from "../Generic/Table";
import SetCategory from "../Caterory/SetCategory";
import { TCategory, TCategoryType } from "../../types/categoryType";
import { compareObjByStr } from "../../helper/string";
import { Title } from "../Generic/Title";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { deleteCategory } from "../../store/reducers/categorySlice";
import {
  selectAccountCategories,
  selectTransactionCategories,
} from "../../store/selectors";
import { setIsUnsaved } from "../../store/reducers/appSlice";

interface CategoriesProps {
  categoryType: TCategoryType;
}

const Categories: FC<CategoriesProps> = ({ categoryType }) => {
  const categorySelectorDict = {
    accounts: selectAccountCategories,
    transactions: selectTransactionCategories,
  };

  const categories = useAppSelector(categorySelectorDict[categoryType]);
  const safeMode = useAppSelector((state) => state.app.safeMode);

  const [isOpen, setIsOpen] = useState(false);
  const [openedCategory, setOpenedCategory] = useState<TCategory>();

  const openCategory = (category?: TCategory) => {
    setOpenedCategory(category);
    setIsOpen(true);
  };

  const sortedCategories = [...categories]
    .sort((a, b) => compareObjByStr(a, b, (e) => e.name))
    .sort((a, b) => +(a.is_archive || false) - +(b.is_archive || false));

  return (
    <>
      <Title>
        {categoryType === "accounts" ? "Account" : "Transaction"} Categories!!!
      </Title>
      <Button color="green" onClick={() => openCategory()}>
        Create Category
      </Button>

      {categories.length ? (
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              {!safeMode && <TH>Hidden</TH>}
              <TH>Archived</TH>
              <TH></TH>
              <TH></TH>
            </TR>
          </THead>
          <TBody>
            {sortedCategories.map((category) => (
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
};

interface CategoryItemProps {
  category: TCategory;
  categoryType: TCategoryType;
  openModal: () => void;
}

const CategoryItem: FC<CategoryItemProps> = ({
  category,
  categoryType,
  openModal,
}) => {
  const {
    account: { accounts },
    transaction: { transactions, templates },
    app: { safeMode },
  } = useAppSelector((state) => state);

  const dispatch = useAppDispatch();

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
            dispatch(deleteCategory({ id: category.id, categoryType }));
            dispatch(setIsUnsaved(true));
          }
        });
  };

  return (
    <TR hide={category.is_archive}>
      <TD>{category.name}</TD>
      {!safeMode && <TD>{category.is_hide && <LockIcon />}</TD>}
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
};

export default Categories;
