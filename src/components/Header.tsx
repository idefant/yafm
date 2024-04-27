import classNames from 'classnames';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { useCreateBaseMutation } from '#api/baseApi';
import { useAppSelector, useAppDispatch } from '#hooks/reduxHooks';
import { accountCategoriesCleared } from '#store/reducers/accountCategoriesSlice';
import { accountsCleared } from '#store/reducers/accountsSlice';
import { setIsUnsaved, lockBase, setArchiveMode } from '#store/reducers/appSlice';
import { currenciesCleared } from '#store/reducers/currenciesSlice';
import { transactionCategoriesCleared } from '#store/reducers/transactionCategoriesSlice';
import { transactionsCleared } from '#store/reducers/transactionsSlice';
import { transactionTemplatesCleared } from '#store/reducers/transactionTemplatesSlice';
import Icon from '#ui/Icon';
import { aesEncrypt } from '#utils/crypto';
import Gzip from '#utils/gzip';
import { getSyncData } from '#utils/sync';

const Header: FC = () => {
  const navigate = useNavigate();

  const [createBase] = useCreateBaseMutation();

  const { archiveMode, isUnsaved, password, openedModalsCount } = useAppSelector(
    (state) => state.app,
  );
  const dispatch = useAppDispatch();

  const sync = async () => {
    if (!password) return;
    const data = aesEncrypt(await Gzip.compress(JSON.stringify(getSyncData())), password);
    createBase(data)
      .unwrap()
      .then(() => {
        dispatch(setIsUnsaved(false));
        Swal.fire({ title: 'Synchronization is successful', icon: 'success' });
      })
      .catch(() => Swal.fire({ title: 'Something went wrong', icon: 'error' }));
  };

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

        <HeaderIconButton onClick={sync} className={classNames(!isUnsaved && 'opacity-40')}>
          <Icon.Upload />
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
