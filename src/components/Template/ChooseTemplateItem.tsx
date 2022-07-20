import { FC } from 'react';
import ReactTooltip from 'react-tooltip';

import { CircleIcon, InfoIcon } from '../../assets/svg';
import { formatPrice } from '../../helper/currencies';
import { useAppSelector } from '../../hooks/reduxHooks';
import {
  selectAccountDict,
  selectCurrencyDict,
  selectTransactionCategoryDict,
} from '../../store/selectors';
import { TTemplate } from '../../types/transactionType';
import { TR, TD, TDIcon } from '../Generic/Table';

interface ChooseTemplateItemProps {
  template: TTemplate;
  choose: () => void;
}

const ChooseTemplateItem: FC<ChooseTemplateItemProps> = ({ template, choose }) => {
  const currencyDict = useAppSelector(selectCurrencyDict);
  const accountDict = useAppSelector(selectAccountDict);
  const categoryDict = useAppSelector(selectTransactionCategoryDict);

  const incomeAccount = template.income?.account_id
    ? accountDict[template.income?.account_id]
    : undefined;
  const outcomeAccount = template.outcome?.account_id
    ? accountDict[template.outcome?.account_id]
    : undefined;

  const incomeCurrency = incomeAccount && currencyDict[incomeAccount.currency_code];
  const outcomeCurrency = outcomeAccount && currencyDict[outcomeAccount.currency_code];

  const categoryName = template.category_id
    ? categoryDict[template.category_id].name
    : '-';

  return (
    <TR>
      <TD>
        <button onClick={choose} type="button">
          <CircleIcon />
        </button>
      </TD>
      <TD>{template.name}</TD>
      <TD className="text-center">{categoryName}</TD>

      {template.outcome && outcomeCurrency && outcomeAccount ? (
        <TD className="text-right">
          <div className="text-red-700">
            {formatPrice(
              template.outcome.sum,
              outcomeCurrency.decimal_places_number,
            )}
            <span className="pl-2.5">{outcomeCurrency.code || ''}</span>
          </div>
          <div className="text-sm text-gray-600">
            {outcomeAccount.name || ''}
          </div>
        </TD>
      ) : (
        <TD className="text-center">-</TD>
      )}

      {template.income && incomeCurrency && incomeAccount ? (
        <TD className="text-right">
          <div className="text-green-700">
            {formatPrice(
              template.income.sum,
              incomeCurrency.decimal_places_number,
            )}
            <span className="pl-2.5">{incomeCurrency.code || ''}</span>
          </div>
          <div className="text-sm text-gray-600">
            {incomeAccount.name || ''}
          </div>
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
    </TR>
  );
};

export default ChooseTemplateItem;
