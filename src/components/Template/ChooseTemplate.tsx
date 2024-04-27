import { FC } from 'react';

import { useAppSelector } from '#hooks/reduxHooks';
import { selectAllTransactionTemplatesCombined } from '#store/selectors';
import { TTransactionTemplate, TTransactionTemplateCombined } from '#types/transactionType';
import Icon from '#ui/Icon';
import Modal from '#ui/Modal';
import Table, { TColumn, TableOperations, TableTooltip } from '#ui/Table';

interface ChooseTemplateProps {
  isOpen: boolean;
  close: () => void;
  // eslint-disable-next-line no-unused-vars
  setTransaction: (template: TTransactionTemplate) => void;
}

const ChooseTemplate: FC<ChooseTemplateProps> = ({ isOpen, close, setTransaction }) => {
  const templates = useAppSelector(selectAllTransactionTemplatesCombined);

  const chooseTemplate = (template: TTransactionTemplate) => {
    setTransaction(template);
    close();
  };

  const tableColumns: TColumn<TTransactionTemplateCombined>[] = [
    {
      key: 'choose',
      render: ({ record }) => (
        <button onClick={() => chooseTemplate(record)} type="button" aria-label="choose template">
          <Icon.Circle />
        </button>
      ),
    },
    {
      title: 'Name',
      key: 'name',
    },
    {
      title: 'Category',
      key: 'category',
      cellClassName: 'text-center',
      render: ({ record }) => record.category?.name,
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
      render: ({ record }) => <TableTooltip>{record.description}</TableTooltip>,
    },
  ];

  return (
    <Modal isOpen={isOpen} close={close} width="biggest">
      <Modal.Header close={close}>Choose Template</Modal.Header>
      <Modal.Content>
        <Table columns={tableColumns} data={templates} className={{ table: 'w-full' }} />
      </Modal.Content>
    </Modal>
  );
};

export default ChooseTemplate;
