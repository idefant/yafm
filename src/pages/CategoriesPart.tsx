import { FC, useState } from 'react';
import Swal from 'sweetalert2';

import { SetCategory } from '../components/Caterory';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import useModal from '../hooks/useModal';
import { setIsUnsaved } from '../store/reducers/appSlice';
import { deleteCategory } from '../store/reducers/categorySlice';
import {
  selectFilteredAccountCategories,
  selectFilteredTransactionCategories,
} from '../store/selectors';
import { TCategory, TCategoryType } from '../types/categoryType';
import Button from '../UI/Button';
import Card from '../UI/Card';
import Icon from '../UI/Icon';
import Table, { TColumn, TableAction } from '../UI/Table';
import { compareObjByStr } from '../utils/string';

interface CategoriesPartProps {
  categoryType: TCategoryType;
}

const CategoriesPart: FC<CategoriesPartProps> = ({ categoryType }) => {
  const categorySelectorDict = {
    accounts: selectFilteredAccountCategories,
    transactions: selectFilteredTransactionCategories,
  };

  const categories = useAppSelector(categorySelectorDict[categoryType]);
  const {
    account: { accounts },
    transaction: { transactions, templates },
    app: { safeMode, archiveMode },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  const categoryModal = useModal();
  const [openedCategory, setOpenedCategory] = useState<TCategory>();

  const openCategory = (category?: TCategory) => {
    setOpenedCategory(category);
    categoryModal.open();
  };

  const sortedCategories = [...categories]
    .sort((a, b) => compareObjByStr(a, b, (e) => e.name))
    .sort((a, b) => +(a.is_archive || false) - +(b.is_archive || false));

  const checkCategoryIsUsed = (categoryId: string) => {
    if (categoryType === 'transactions') {
      const isFound = [...transactions, ...templates].some(
        ({ category_id: transactionCategoryId }) => transactionCategoryId === categoryId,
      );
      if (isFound) return true;
    }

    if (categoryType === 'accounts') {
      const isFound = accounts.some(
        ({ category_id: accountCategoryId }) => accountCategoryId === categoryId,
      );
      if (isFound) return true;
    }
    return false;
  };

  const confirmDelete = (category: TCategory) => {
    if (checkCategoryIsUsed(category.id)) {
      Swal.fire({
        title: 'Unable to delete category',
        text: `There are ${categoryType} or templates using this category`,
        icon: 'error',
      });
    } else {
      Swal.fire({
        title: 'Delete category',
        icon: 'error',
        text: category.name,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete',
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteCategory({ id: category.id, categoryType }));
          dispatch(setIsUnsaved(true));
        }
      });
    }
  };

  const tableColumns: TColumn<TCategory>[] = [
    {
      title: 'Name',
      key: 'name',
    },
    {
      title: <Icon.Lock className="w-[22px] h-[22px]" />,
      key: 'is_hide',
      render: ({ record }) => record.is_hide && <Icon.Lock className="w-[22px] h-[22px]" />,
      default: '',
      hidden: safeMode,
    },
    {
      title: <Icon.Archive className="w-[22px] h-[22px]" />,
      key: 'is_archive',
      render: ({ record }) => record.is_archive && <Icon.Archive className="w-[22px] h-[22px]" />,
      default: '',
      hidden: !archiveMode,
    },
    {
      key: 'actions',
      cellClassName: '!p-0',
      width: 'min',
      render: ({ record }) => (
        <div className="flex ml-6">
          <TableAction onClick={() => openCategory(record)} icon={Icon.Pencil} />
          <TableAction onClick={() => confirmDelete(record)} icon={Icon.Trash} />
        </div>
      ),
    },
  ];

  return (
    <>
      <Card>
        <Card.Header>
          {categoryType === 'accounts' ? 'Account' : 'Transaction'} Categories
        </Card.Header>

        <Card.Body>
          <Button color="green" onClick={() => openCategory()} className="mb-2">
            Create Category
          </Button>

          <Table
            columns={tableColumns}
            data={sortedCategories}
            isTranslucentRow={(record) => record.is_archive}
            className={{ table: 'w-full' }}
          />
        </Card.Body>
      </Card>

      <SetCategory
        isOpen={categoryModal.isOpen}
        close={categoryModal.close}
        categoryType={categoryType}
        category={openedCategory}
      />
    </>
  );
};

export default CategoriesPart;
