import { FC, useState } from 'react';
import Swal from 'sweetalert2';

import { SetCategory } from '#components/Category';
import { useAppSelector } from '#hooks/reduxHooks';
import {
  selectAllAccounts,
  selectAllTransactionTemplates,
  selectAllTransactions,
  selectVisibleAccountCategories,
  selectVisibleTransactionCategories,
} from '#store/selectors';
import ArchiveIcon from '#svg/archive.svg?react';
import PencilIcon from '#svg/pencil.svg?react';
import PlusIcon from '#svg/plus.svg?react';
import TrashIcon from '#svg/trash.svg?react';
import { CategoryType, Category } from '#types/categoryType';
import { Button } from '#ui/Button';
import { Card } from '#ui/Card';
import { useModal } from '#ui/Modal';
import { HStack } from '#ui/Stack';
import Table, { Column, TableAction } from '#ui/Table';
import { Title } from '#ui/Typography';
import { actionCreator, committer } from '#utils/committer';

interface CategoriesPartProps {
  categoryType: CategoryType;
}

const selectCategoryDict = {
  accounts: selectVisibleAccountCategories,
  transactions: selectVisibleTransactionCategories,
};

const CategoriesPart: FC<CategoriesPartProps> = ({ categoryType }) => {
  const categories = useAppSelector(selectCategoryDict[categoryType]);
  const accounts = useAppSelector(selectAllAccounts);
  const transactions = useAppSelector(selectAllTransactions);
  const templates = useAppSelector(selectAllTransactionTemplates);
  const archiveMode = useAppSelector((state) => state.app.archiveMode);

  const categoryModal = useModal();
  const [openedCategory, setOpenedCategory] = useState<Category>();

  const openCategory = (category?: Category) => {
    setOpenedCategory(category);
    categoryModal.open();
  };

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

  const confirmDelete = (category: Category) => {
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
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (categoryType === 'accounts') {
            committer(actionCreator.deleteAccountCategory(category.id)).sync();
          }
          if (categoryType === 'transactions') {
            committer(actionCreator.deleteTransactionCategory(category.id)).sync();
          }
        }
      });
    }
  };

  const tableColumns: Column<Category>[] = [
    {
      title: 'Name',
      key: 'name',
    },
    {
      title: <ArchiveIcon className="w-[22px] h-[22px]" />,
      key: 'is_archive',
      render: ({ record }) => record.is_archive && <ArchiveIcon className="w-[22px] h-[22px]" />,
      default: '',
      hidden: !archiveMode,
    },
    {
      key: 'actions',
      cellClassName: '!p-0',
      width: 'min',
      render: ({ record }) => (
        <div className="flex ml-6">
          <TableAction onClick={() => openCategory(record)} icon={PencilIcon} />
          <TableAction onClick={() => confirmDelete(record)} icon={TrashIcon} />
        </div>
      ),
    },
  ];

  return (
    <>
      <Card>
        <Card.Content>
          <HStack justify="spaceBetween" align="baseline">
            <Title level={4} gutterBottom>
              {categoryType === 'accounts' ? 'Account' : 'Transaction'} Categories
            </Title>

            <Button
              color="success"
              size="sm"
              startIcon={<PlusIcon />}
              onClick={() => openCategory()}
            >
              Create
            </Button>
          </HStack>

          <Table
            columns={tableColumns}
            data={categories}
            isTranslucentRow={(record) => record.is_archive}
            className={{ table: 'w-full' }}
          />
        </Card.Content>
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
