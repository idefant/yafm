import { FC, useState } from 'react';
import Swal from 'sweetalert2';

import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import useModal from '../../hooks/useModal';
import { setIsUnsaved } from '../../store/reducers/appSlice';
import { deleteTemplate } from '../../store/reducers/transactionSlice';
import {
  selectFilteredTemplates,
  selectTransactionCategoryDict,
} from '../../store/selectors';
import { TTemplate } from '../../types/transactionType';
import Button from '../Generic/Button/Button';
import Icon from '../Generic/Icon';
import Table, {
  TColumn,
  TableAction,
  TableOperations,
  TableTooltip,
} from '../Generic/Table';
import { Title } from '../Generic/Title';
import SetTemplate from '../Template/SetTemplate';

const Templates: FC = () => {
  const templates = useAppSelector(selectFilteredTemplates);
  const categoryDict = useAppSelector(selectTransactionCategoryDict);
  const dispatch = useAppDispatch();

  const templateModal = useModal();
  const [openedTemplate, setOpenedTemplate] = useState<TTemplate>();

  const openTemplate = (template?: TTemplate) => {
    setOpenedTemplate(template);
    templateModal.open();
  };

  const confirmDelete = (template: TTemplate) => {
    Swal.fire({
      title: 'Delete template',
      icon: 'error',
      text: template.name,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteTemplate(template.id));
        dispatch(setIsUnsaved(true));
      }
    });
  };

  const tableColumns: TColumn<TTemplate>[] = [
    {
      title: 'Name',
      key: 'name',
    },
    {
      title: 'Category',
      key: 'category',
      cellClassName: 'text-center',
      render: ({ record }) => (
        record.category_id && categoryDict[record.category_id].name
      ),
    },
    {
      title: 'Outcome',
      key: 'outcome',
      render: ({ record }) => (
        <TableOperations
          operations={record.operations}
          isPositive={false}
        />
      ),
    },
    {
      title: 'Income',
      key: 'income',
      render: ({ record }) => (
        <TableOperations
          operations={record.operations}
          isPositive
        />
      ),
    },
    {
      title: <Icon.Info className="w-6 h-6 mx-auto" />,
      key: 'description',
      render: ({ record }) => (
        <TableTooltip id={`tr_${record.id}`}>
          {record.description}
        </TableTooltip>
      ),
    },
    {
      key: 'actions',
      cellClassName: '!p-0',
      render: ({ record }) => (
        <div className="flex">
          <TableAction onClick={() => openTemplate(record)} icon={Icon.Pencil} />
          <TableAction onClick={() => confirmDelete(record)} icon={Icon.Trash} />
        </div>
      ),
    },
  ];

  return (
    <>
      <Title>Templates</Title>

      <Button color="green" onClick={() => openTemplate()} className="mb-4">
        Create
      </Button>

      {templates.length ? (
        <Table
          columns={tableColumns}
          data={templates}
        />
      ) : (
        <div className="font-sans text-3xl">¯\_(ツ)_/¯</div>
      )}

      <SetTemplate
        isOpen={templateModal.isOpen}
        close={templateModal.close}
        template={openedTemplate}
      />
    </>
  );
};

export default Templates;
