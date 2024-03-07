import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { FC } from 'react';

import { useAppSelector } from '#hooks/reduxHooks';
import { selectAccountDict, selectCurrencyDict } from '#store/selectors';
import { TOperation } from '#types/transactionType';
import money from '#utils/money';

import TableDefaultText from './TableDefaultText';

interface TableOperationsProps {
  operations: TOperation[];
  isPositive: boolean;
}

const TableOperations: FC<TableOperationsProps> = ({ operations, isPositive }) => {
  const currencyDict = useAppSelector(selectCurrencyDict);
  const accountDict = useAppSelector(selectAccountDict);

  const filteredOperations = operations.filter((operation) =>
    isPositive ? BigNumber(operation.sum).isPositive() : BigNumber(operation.sum).isNegative(),
  );

  if (!filteredOperations.length) {
    return <TableDefaultText />;
  }

  return (
    <div className="text-right grid gap-2">
      {filteredOperations.map((outcome, index) => {
        const account = accountDict[outcome.account_id];
        const currency = currencyDict[account.currency_code];

        return (
          <div key={index}>
            <div
              className={classNames('font-bold', isPositive ? 'text-green-500' : 'text-red-500')}
            >
              {money(BigNumber(outcome.sum).abs()).format()}
              <span className="pl-2.5">{currency.code}</span>
            </div>
            <div className="text-sm text-gray-300">{account.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default TableOperations;
