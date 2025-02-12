import { createColumnHelper, getCoreRowModel, Row, useReactTable } from '@tanstack/react-table';
import { FC, useCallback } from 'react';
import Swal from 'sweetalert2';

import { SetCategory, SetCategoryModalData } from '#components/Category';
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
import { Table } from '#ui/Table';
import { Title } from '#ui/Typography';
import { actionCreator, committer } from '#utils/committer';

interface CategoriesPartProps {
  categoryType: CategoryType;
}

const selectCategoryDict = {
  accounts: selectVisibleAccountCategories,
  transactions: selectVisibleTransactionCategories,
};

const columnHelper = createColumnHelper<Category>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    size: Number.MAX_SAFE_INTEGER,
    cell: (info) => info.getValue(),
  }),
];

export const CategoriesPart: FC<CategoriesPartProps> = ({ categoryType }) => {
  const categories = useAppSelector(selectCategoryDict[categoryType]);
  const accounts = useAppSelector(selectAllAccounts);
  const transactions = useAppSelector(selectAllTransactions);
  const templates = useAppSelector(selectAllTransactionTemplates);

  const categoryModal = useModal<SetCategoryModalData>();

  const checkCategoryIsUsed = useCallback(
    (categoryId: string) => {
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
    },
    [accounts, categoryType, templates, transactions],
  );

  const table = useReactTable({
    data: categories,
    columns,
    getRowId: (original) => original.id,
    getCoreRowModel: getCoreRowModel(),
  });

  const confirmDelete = useCallback(
    (category: Category) => {
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
    },
    [categoryType, checkCategoryIsUsed],
  );

  const getRowContextMenu = useCallback(
    (row: Row<Category>) => ({
      items: [
        {
          key: 'edit',
          label: 'Edit',
          icon: PencilIcon,
          onClick: () =>
            categoryModal.open({ method: 'edit', category: row.original, categoryType }),
        },
        {
          key: 'archive',
          label: 'Archive',
          icon: ArchiveIcon,
          onClick: () => {
            if (categoryType === 'accounts') {
              committer(
                actionCreator.updateAccountCategory(row.original.id, { is_archive: true }),
              ).sync();
            } else {
              committer(
                actionCreator.updateTransactionCategory(row.original.id, { is_archive: true }),
              ).sync();
            }
          },
        },
        {
          key: 'delete',
          label: 'Delete',
          icon: TrashIcon,
          onClick: () => confirmDelete(row.original),
        },
      ],
    }),
    [categoryModal, categoryType, confirmDelete],
  );

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
              onClick={() => categoryModal.open({ method: 'create', categoryType })}
            >
              Create
            </Button>
          </HStack>

          <Table
            table={table}
            fullWidth
            rowContextMenu={getRowContextMenu}
            rowOnClick={(row) =>
              categoryModal.open({ method: 'edit', category: row.original, categoryType })
            }
          />
        </Card.Content>
      </Card>

      <SetCategory modal={categoryModal} />
    </>
  );
};
