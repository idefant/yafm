import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { FC } from 'react';

import { TOperationCombined } from '#types/transactionType';
import money from '#utils/money';

import TableDefaultText from './TableDefaultText';

interface TableOperationsProps {
  operations: TOperationCombined[];
  isPositive: boolean;
}

const TableOperations: FC<TableOperationsProps> = ({ operations, isPositive }) => {
  const filteredOperations = operations.filter((operation) =>
    isPositive ? BigNumber(operation.sum).isPositive() : BigNumber(operation.sum).isNegative(),
  );

  if (!filteredOperations.length) {
    return <TableDefaultText />;
  }

  return (
    <div className="text-right grid gap-2">
      {filteredOperations.map((operation, index) => (
        <div key={index}>
          <div className={classNames('font-bold', isPositive ? 'text-green-500' : 'text-red-500')}>
            {money(BigNumber(operation.sum).abs()).format()}
            <span className="pl-2.5">{operation.account.currency_code}</span>
          </div>
          <div className="text-sm text-gray-300">{operation.account.name}</div>
        </div>
      ))}
    </div>
  );
};

export default TableOperations;
