import { FC } from 'react';

import { useAppSelector } from '../../hooks/reduxHooks';
import { selectFilteredTemplates } from '../../store/selectors';
import { TTemplate } from '../../types/transactionType';
import Modal from '../Generic/Modal';
import Table, {
  THead, TR, TH, TBody,
} from '../Generic/Table';

import ChooseTemplateItem from './ChooseTemplateItem';

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

  return (
    <Modal isOpen={isOpen} close={close} width="biggest">
      <Modal.Header close={close}>Choose Template</Modal.Header>
      <Modal.Content>
        {templates.length === 0 ? (
          <div className="font-sans text-3xl text-center mt-8 mb-3">
            ¯\_(ツ)_/¯
          </div>
        ) : (
          <Table className="w-full">
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
              {templates.map((template) => (
                <ChooseTemplateItem
                  template={template}
                  key={template.id}
                  choose={() => {
                    setTransaction(template);
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
