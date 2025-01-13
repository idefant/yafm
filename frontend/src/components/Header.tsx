import classNames from 'classnames';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '#hooks/reduxHooks';
import { accountCategoriesCleared } from '#store/reducers/accountCategoriesSlice';
import { accountsCleared } from '#store/reducers/accountsSlice';
import { lockBase, setArchiveMode } from '#store/reducers/appSlice';
import { currenciesCleared } from '#store/reducers/currenciesSlice';
import { transactionCategoriesCleared } from '#store/reducers/transactionCategoriesSlice';
import { transactionsCleared } from '#store/reducers/transactionsSlice';
import { transactionTemplatesCleared } from '#store/reducers/transactionTemplatesSlice';
import Icon from '#ui/Icon';

const Header: FC = () => {
  const navigate = useNavigate();

  const { archiveMode, openedModalsCount } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  const lock = () => {
    dispatch(currenciesCleared());
    dispatch(accountsCleared());
    dispatch(accountCategoriesCleared());
    dispatch(transactionsCleared());
    dispatch(transactionCategoriesCleared());
    dispatch(transactionTemplatesCleared());
    dispatch(lockBase());
    navigate('/decrypt');
  };

  return (
    <div
      className={classNames(
        'flex items-center justify-between bg-slate-900 py-3 sticky top-0 z-10 border-b border-b-slate-300/30',
        openedModalsCount && 'blur',
      )}
    >
      <div className="text-white text-2xl text-center font-bold w-60">YAFM</div>

      <div className="flex px-6 gap-2 md:gap-6 items-center">
        <HeaderIconButton
          onClick={() => dispatch(setArchiveMode(!archiveMode))}
          className={classNames(!archiveMode && 'opacity-40')}
        >
          <Icon.Archive />
        </HeaderIconButton>

        <HeaderIconButton onClick={lock}>
          <Icon.Lock className="text-white" />
        </HeaderIconButton>
      </div>
    </div>
  );
};

const HeaderIconButton: FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  ...props
}) => (
  <button
    className={classNames('block text-sm px-3 py-1.5 text-white', className)}
    type="button"
    {...props}
  />
);

export default Header;
