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
import { TTemplate, TOperationExtended } from '../../types/transactionType';
import { TR, TD, TDIcon } from '../Generic/Table';

interface ChooseTemplateItemProps {
  template: TTemplate;
  choose: () => void;
}

const ChooseTemplateItem: FC<ChooseTemplateItemProps> = ({ template, choose }) => {
  const currencyDict = useAppSelector(selectCurrencyDict);
  const accountDict = useAppSelector(selectAccountDict);
  const categoryDict = useAppSelector(selectTransactionCategoryDict);

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

  return (
    <TR>
      <TD>
        <button onClick={choose} type="button">
          <CircleIcon />
        </button>
      </TD>
      <TD>{template.name}</TD>
      <TD className="text-center">{categoryName}</TD>

      {outcomes.length ? (
        <TD className="text-right">
          {outcomes.map((outcome, index) => (
            <div key={index}>
              <div className="text-red-700">
                {formatPrice(
                  -outcome.sum,
                  outcome.currency.decimal_places_number,
                )}
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
        <TD className="text-right">
          {incomes.map((income, index) => (
            <div key={index}>
              <div className="text-green-700">
                {formatPrice(
                  income.sum,
                  income.currency.decimal_places_number,
                )}
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
    </TR>
  );
};

export default ChooseTemplateItem;
