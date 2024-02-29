import { FC, useState } from 'react';
import Swal from 'sweetalert2';

import { SetTemplate } from '#components/Template';
import { useAppSelector, useAppDispatch } from '#hooks/reduxHooks';
import useModal from '#hooks/useModal';
import { setIsUnsaved } from '#store/reducers/appSlice';
import { deleteTemplate } from '#store/reducers/transactionSlice';
import { selectFilteredTemplates, selectTransactionCategoryDict } from '#store/selectors';
import { TTemplate } from '#types/transactionType';
import Button from '#ui/Button';
import Card from '#ui/Card';
import Icon from '#ui/Icon';
import Table, { TColumn, TableOperations, TableTooltip, TableAction } from '#ui/Table';
import { Title } from '#ui/Title';

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
      render: ({ record }) => record.category_id && categoryDict[record.category_id].name,
    },
    {
      title: 'Outcome',
      key: 'outcome',
      render: ({ record }) => <TableOperations operations={record.operations} isPositive={false} />,
    },
    {
      title: 'Income',
      key: 'income',
      render: ({ record }) => <TableOperations operations={record.operations} isPositive />,
    },
    {
      title: <Icon.Info className="w-6 h-6 mx-auto" />,
      key: 'description',
      width: 'min',
      render: ({ record }) => (
        <TableTooltip id={`tr_${record.id}`}>{record.description}</TableTooltip>
      ),
    },
    {
      key: 'actions',
      cellClassName: '!p-0',
      width: 'min',
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

      <Card>
        <Card.Header>List of Templates</Card.Header>

        <Card.Body>
          <Button color="green" onClick={() => openTemplate()} className="mb-2">
            Create
          </Button>

          <Table columns={tableColumns} data={templates} className={{ table: 'w-full' }} />
        </Card.Body>
      </Card>

      <SetTemplate
        isOpen={templateModal.isOpen}
        close={templateModal.close}
        template={openedTemplate}
      />
    </>
  );
};

export default Templates;
