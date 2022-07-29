import { FC } from 'react';

import { useAppSelector } from '../../hooks/reduxHooks';
import { selectFilteredTemplates, selectTransactionCategoryDict } from '../../store/selectors';
import { TTemplate } from '../../types/transactionType';
import Icon from '../Generic/Icon';
import Modal from '../Generic/Modal';
import Table, { TColumn, TableOperations, TableTooltip } from '../Generic/Table';

interface ChooseTemplateProps {
  isOpen: boolean;
  close: () => void;
  // eslint-disable-next-line no-unused-vars
  setTransaction: (template: TTemplate) => void;
}

const ChooseTemplate: FC<ChooseTemplateProps> = ({
  isOpen,
  close,
  setTransaction,
}) => {
  const templates = useAppSelector(selectFilteredTemplates);
  const categoryDict = useAppSelector(selectTransactionCategoryDict);

  const chooseTemplate = (template: TTemplate) => {
    setTransaction(template);
    close();
  };

  const tableColumns: TColumn<TTemplate>[] = [
    {
      key: 'choose',
      render: ({ record }) => (
        <button
          onClick={() => chooseTemplate(record)}
          type="button"
        >
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
        <TableTooltip id={`template_${record.id}`}>
          {record.description}
        </TableTooltip>
      ),
    },
  ];

  return (
    <Modal isOpen={isOpen} close={close} width="biggest">
      <Modal.Header close={close}>Choose Template</Modal.Header>
      <Modal.Content>
        {templates.length === 0 ? (
          <div className="font-sans text-3xl text-center mt-8 mb-3">
            ¯\_(ツ)_/¯
          </div>
        ) : (
          <Table
            columns={tableColumns}
            data={templates}
            className={{ table: 'w-full' }}
          />
        )}
      </Modal.Content>
    </Modal>
  );
};

export default ChooseTemplate;
