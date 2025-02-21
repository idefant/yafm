import { createColumnHelper, getCoreRowModel, Row, useReactTable } from '@tanstack/react-table';
import { FC, useCallback } from 'react';

import {
  confirmAccountGroupDeletion,
  SetAccountGroupModal,
  SetAccountGroupModalData,
} from '#components/AccountGroup';
import { HeaderInfo } from '#components/Header';
import { appRoutes } from '#data/routes';
import { useAppSelector } from '#hooks/reduxHooks';
import { selectAllAccountGroups } from '#store/selectors';
import PencilIcon from '#svg/pencil.svg?react';
import PlusIcon from '#svg/plus.svg?react';
import TrashIcon from '#svg/trash.svg?react';
import { AccountGroup } from '#types/accountGroupType';
import { Button } from '#ui/Button';
import { Card } from '#ui/Card';
import { Grid } from '#ui/Grid';
import { useModal } from '#ui/Modal';
import { Table } from '#ui/Table';
import { Title } from '#ui/Typography';

const columnHelper = createColumnHelper<AccountGroup>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    size: Number.MAX_SAFE_INTEGER,
    cell: (info) => info.getValue(),
  }),
];

export const AccountGroups: FC = () => {
  const groups = useAppSelector(selectAllAccountGroups);

  const groupModal = useModal<SetAccountGroupModalData>();

  const table = useReactTable({
    data: groups,
    columns,
    getRowId: (original) => original.id,
    getCoreRowModel: getCoreRowModel(),
  });

  const getRowContextMenu = useCallback(
    (row: Row<AccountGroup>) => ({
      label: row.original.name,
      items: [
        {
          key: 'edit',
          label: 'Edit',
          icon: PencilIcon,
          onClick: () => groupModal.open({ method: 'edit', group: row.original }),
        },
        {
          key: 'delete',
          label: 'Delete',
          icon: TrashIcon,
          onClick: () => confirmAccountGroupDeletion(row.original),
        },
      ],
    }),
    [groupModal],
  );

  return (
    <>
      <HeaderInfo
        title="Account Groups"
        backUrl={appRoutes.accounts}
        endAddition={
          <Button
            color="success"
            size="sm"
            startIcon={<PlusIcon />}
            onClick={() => groupModal.open({ method: 'create' })}
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
                List of Groups
              </Title>

              <Table
                table={table}
                fullWidth
                rowContextMenu={getRowContextMenu}
                rowOnClick={(row) => groupModal.open({ method: 'edit', group: row.original })}
              />
            </Card.Content>
          </Card>
        </Grid.Item>
      </Grid>
      <SetAccountGroupModal modal={groupModal} />
    </>
  );
};
