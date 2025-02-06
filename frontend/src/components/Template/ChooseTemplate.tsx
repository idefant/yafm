import { FC } from 'react';

import { useAppSelector } from '#hooks/reduxHooks';
import { selectAllTransactionTemplatesCombined } from '#store/selectors';
import InfoIcon from '#svg/info.svg?react';
import { TransactionTemplate, TransactionTemplateCombined } from '#types/transactionType';
import { Modal } from '#ui/Modal';
import Table, { Column, TableOperations, TableTooltip } from '#ui/Table';

interface ChooseTemplateProps {
  isOpen: boolean;
  close: () => void;
  // eslint-disable-next-line no-unused-vars
  setTransaction: (template: TransactionTemplate) => void;
}

const ChooseTemplate: FC<ChooseTemplateProps> = ({ isOpen, close, setTransaction }) => {
  const templates = useAppSelector(selectAllTransactionTemplatesCombined);

  const chooseTemplate = (template: TransactionTemplate) => {
    setTransaction(template);
    close();
  };

  const tableColumns: Column<TransactionTemplateCombined>[] = [
    {
      key: 'choose',
      render: ({ record }) => (
        <button onClick={() => chooseTemplate(record)} type="button" aria-label="choose template">
          choose
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
      title: <InfoIcon className="w-6 h-6 mx-auto" />,
      key: 'description',
      width: 'min',
      render: ({ record }) => <TableTooltip>{record.description}</TableTooltip>,
    },
  ];

  return (
    <Modal title="Choose Template" isOpen={isOpen} close={close}>
      <Modal.Content>
        <Table columns={tableColumns} data={templates} className={{ table: 'w-full' }} />
      </Modal.Content>
    </Modal>
  );
};

export default ChooseTemplate;
