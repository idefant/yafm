import { FC, useState } from 'react';

import { MinusIcon, PlusIcon, RepeatIcon } from '../../assets/svg';
import { useAppSelector } from '../../hooks/reduxHooks';
import { selectFilteredTemplates } from '../../store/selectors';
import { TTemplate, TTransactionType } from '../../types/transactionType';
import ActionButton from '../Generic/Button/ActionButton';
import Modal from '../Generic/Modal';
import Table, {
  THead, TR, TH, TBody,
} from '../Generic/Table';

import ChooseTemplateItem from './ChooseTemplateItem';

interface ChooseTemplateProps {
  isOpen: boolean;
  close: () => void;
  // eslint-disable-next-line no-unused-vars
  setTransaction: (template: TTemplate, transactionType: TTransactionType) => void;
  transactionType: TTransactionType;
}

const ChooseTemplate: FC<ChooseTemplateProps> = ({
  isOpen,
  close,
  setTransaction,
  transactionType: startTransactionType,
}) => {
  const templates = useAppSelector(selectFilteredTemplates);

  const [transactionType, setTransactionType] = useState<TTransactionType>('outcome');

  const displayedTemplates = templates.filter(
    (template) => template.type === transactionType,
  );

  const onEnter = () => {
    setTransactionType(startTransactionType);
  };

  return (
    <Modal isOpen={isOpen} close={close} width="biggest" onEnter={onEnter}>
      <Modal.Header close={close}>Choose Template</Modal.Header>
      <Modal.Content>
        <div className="flex justify-center gap-6">
          <ActionButton
            onClick={() => setTransactionType('outcome')}
            color="red"
            active={transactionType === 'outcome'}
            shadow={transactionType === 'outcome'}
          >
            <MinusIcon className="w-7 h-7" />
          </ActionButton>

          <ActionButton
            onClick={() => setTransactionType('income')}
            color="green"
            active={transactionType === 'income'}
            shadow={transactionType === 'income'}
          >
            <PlusIcon className="w-7 h-7" />
          </ActionButton>

          <ActionButton
            onClick={() => setTransactionType('exchange')}
            active={transactionType === 'exchange'}
            shadow={transactionType === 'exchange'}
          >
            <RepeatIcon className="w-7 h-7" />
          </ActionButton>
        </div>

        {displayedTemplates.length === 0 ? (
          <div className="font-sans text-3xl text-center mt-8 mb-3">
            ¯\_(ツ)_/¯
          </div>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH />
                <TH>Name</TH>
                <TH>Category</TH>
                <TH>Outcome</TH>
                <TH>Income</TH>
                <TH />
              </TR>
            </THead>
            <TBody>
              {displayedTemplates.map((template) => (
                <ChooseTemplateItem
                  template={template}
                  key={template.id}
                  choose={() => {
                    setTransaction(template, transactionType);
                    close();
                  }}
                />
              ))}
            </TBody>
          </Table>
        )}
      </Modal.Content>
    </Modal>
  );
};

export default ChooseTemplate;
