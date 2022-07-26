import { FC, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import Swal from 'sweetalert2';

import { InfoIcon, PencilIcon, TrashIcon } from '../../assets/svg';
import { formatPrice } from '../../helper/currencies';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setIsUnsaved } from '../../store/reducers/appSlice';
import { deleteTemplate } from '../../store/reducers/transactionSlice';
import {
  selectAccountDict,
  selectCurrencyDict,
  selectFilteredTemplates,
  selectTransactionCategoryDict,
} from '../../store/selectors';
import { TTemplate, TOperationExtended } from '../../types/transactionType';
import Button from '../Generic/Button/Button';
import Table, {
  TBody, TD, TDIcon, TH, THead, TR,
} from '../Generic/Table';
import { Title } from '../Generic/Title';
import SetTemplate from '../Template/SetTemplate';

const Templates: FC = () => {
  const templates = useAppSelector(selectFilteredTemplates);

  const [isOpen, setIsOpen] = useState(false);
  const [openedTemplate, setOpenedTemplate] = useState<TTemplate>();

  const openTemplate = (template?: TTemplate) => {
    setOpenedTemplate(template);
    setIsOpen(true);
  };

  return (
    <>
      <Title>Templates</Title>

      <Button color="green" onClick={() => openTemplate()}>
        Create
      </Button>

      {templates.length ? (
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Category</TH>
              <TH>Outcome</TH>
              <TH>Income</TH>
              <TH />
              <TH />
              <TH />
            </TR>
          </THead>
          <TBody>
            {templates.map((template) => (
              <TemplateItem
                template={template}
                openModal={() => openTemplate(template)}
                key={template.id}
              />
            ))}
          </TBody>
        </Table>
      ) : (
        <div className="font-sans text-3xl">¯\_(ツ)_/¯</div>
      )}

      <SetTemplate
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        template={openedTemplate}
      />
    </>
  );
};

interface TemplateItemProps {
  template: TTemplate;
  openModal: () => void;
}

const TemplateItem: FC<TemplateItemProps> = ({ template, openModal }) => {
  const currencyDict = useAppSelector(selectCurrencyDict);
  const accountDict = useAppSelector(selectAccountDict);
  const categoryDict = useAppSelector(selectTransactionCategoryDict);
  const dispatch = useAppDispatch();

  const operations: TOperationExtended[] = template.operations.map((operation) => ({
    ...operation,
    account: accountDict[operation.account_id],
    currency: currencyDict[accountDict[operation.account_id].currency_code],
  }));

  const { incomes, outcomes } = operations.reduce((
    acc: { incomes: TOperationExtended[]; outcomes: TOperationExtended[] },
    operation,
  ) => {
    (operation.sum < 0 ? acc.outcomes : acc.incomes).push(operation);
    return acc;
  }, { incomes: [], outcomes: [] });

  const categoryName = template.category_id
    ? categoryDict[template.category_id].name
    : '-';

  const confirmDelete = () => {
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

  return (
    <TR>
      <TD>{template.name}</TD>
      <TD className="text-center">{categoryName}</TD>

      {outcomes.length ? (
        <TD className="text-right">
          {outcomes.map((outcome, index) => (
            <div key={index}>
              <div className="text-red-700">
                {formatPrice(-outcome.sum, outcome.currency.decimal_places_number)}
                <span className="pl-2.5">{outcome.currency.code}</span>
              </div>
              <div className="text-sm text-gray-600">
                {outcome.account.name}
              </div>
            </div>
          ))}
        </TD>
      ) : (
        <TD className="text-center">-</TD>
      )}

      {incomes.length ? (
        <TD className="text-right grid gap-4">
          {incomes.map((income, index) => (
            <div key={index}>
              <div className="text-green-700">
                {formatPrice(income.sum, income.currency.decimal_places_number)}
                <span className="pl-2.5">{income.currency.code || ''}</span>
              </div>
              <div className="text-sm text-gray-600">
                {income.account.name || ''}
              </div>
            </div>
          ))}
        </TD>
      ) : (
        <TD className="text-center">-</TD>
      )}

      <TDIcon>
        {template.description && (
          <>
            <div data-tip data-for={`tr_${template.id}`} className="px-3">
              <InfoIcon className="w-7 h-7" />
            </div>
            <ReactTooltip
              id={`tr_${template.id}`}
              effect="solid"
              className="max-w-sm"
            >
              {template.description}
            </ReactTooltip>
          </>
        )}
      </TDIcon>

      <TDIcon>
        <button className="p-2" onClick={openModal} type="button">
          <PencilIcon className="w-7 h-7" />
        </button>
      </TDIcon>
      <TDIcon>
        <button className="p-2" onClick={confirmDelete} type="button">
          <TrashIcon className="w-7 h-7" />
        </button>
      </TDIcon>
    </TR>
  );
};

export default Templates;
