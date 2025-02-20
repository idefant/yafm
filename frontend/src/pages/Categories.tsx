import { createColumnHelper, getCoreRowModel, Row, useReactTable } from '@tanstack/react-table';
import { FC, useCallback } from 'react';

import { SetCategory, SetCategoryModalData } from '#components/Category';
import { HeaderInfo } from '#components/Header';
import { useAppSelector } from '#hooks/reduxHooks';
import {
  selectAllTemplates,
  selectAllTransactions,
  selectVisibleCategories,
} from '#store/selectors';
import ArchiveIcon from '#svg/archive.svg?react';
import PencilIcon from '#svg/pencil.svg?react';
import PlusIcon from '#svg/plus.svg?react';
import TrashIcon from '#svg/trash.svg?react';
import { Category } from '#types/categoryType';
import { Button } from '#ui/Button';
import { Card } from '#ui/Card';
import { Grid } from '#ui/Grid';
import { dmodal, useModal } from '#ui/Modal';
import { Table } from '#ui/Table';
import { Title } from '#ui/Typography';
import { actionCreator, committer } from '#utils/committer';

const columnHelper = createColumnHelper<Category>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    size: Number.MAX_SAFE_INTEGER,
    cell: (info) => info.getValue(),
  }),
];

export const Categories: FC = () => {
  const categories = useAppSelector(selectVisibleCategories);
  const transactions = useAppSelector(selectAllTransactions);
  const templates = useAppSelector(selectAllTemplates);

  const categoryModal = useModal<SetCategoryModalData>();

  const checkCategoryIsUsed = useCallback(
    (id: string) => {
      const isFound = [...transactions, ...templates].some(({ categoryId }) => categoryId === id);
      if (isFound) return true;

      return false;
    },
    [templates, transactions],
  );

  const table = useReactTable({
    data: categories,
    columns,
    getRowId: (original) => original.id,
    getCoreRowModel: getCoreRowModel(),
  });

  const confirmDelete = useCallback(
    async (category: Category) => {
      if (checkCategoryIsUsed(category.id)) {
        dmodal.error({
          title: 'Unable to delete category',
          content: 'There are transactions or templates using this category',
          showCancel: false,
        });
        return;
      }

      const modalResult = await dmodal.error({
        title: 'Delete category',
        content: `Category name: ${category.name}`,
        confirmText: 'Delete',
        confirmColor: 'danger',
      });

      if (modalResult.isConfirmed) {
        committer(actionCreator.deleteCategory(category.id)).sync();
      }
    },
    [checkCategoryIsUsed],
  );

  const getRowContextMenu = useCallback(
    (row: Row<Category>) => ({
      items: [
        {
          key: 'edit',
          label: 'Edit',
          icon: PencilIcon,
          onClick: () => categoryModal.open({ method: 'edit', category: row.original }),
        },
        {
          key: 'archive',
          label: 'Archive',
          icon: ArchiveIcon,
          onClick: () => {
            committer(actionCreator.updateCategory(row.original.id, { isArchived: true })).sync();
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
    [categoryModal, confirmDelete],
  );

  return (
    <>
      <HeaderInfo
        title="Categories"
        endAddition={
          <Button
            color="success"
            size="sm"
            startIcon={<PlusIcon />}
            onClick={() => categoryModal.open({ method: 'create' })}
          >
            Create
          </Button>
        }
        endAdditionGap={24}
      />

      <Grid gap={16}>
        <Grid.Item size={6}>
          <Card>
            <Card.Content>
              <Title level={4} gutterBottom>
                List of Categories
              </Title>

              <Table
                table={table}
                fullWidth
                rowContextMenu={getRowContextMenu}
                rowOnClick={(row) => categoryModal.open({ method: 'edit', category: row.original })}
              />
            </Card.Content>
          </Card>
        </Grid.Item>
      </Grid>
      <SetCategory modal={categoryModal} />
    </>
  );
};
