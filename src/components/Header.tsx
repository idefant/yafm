import classNames from 'classnames';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { aesEncrypt } from '../helper/crypto';
import { setBaseRequest } from '../helper/requests/versionRequests';
import { getSyncData } from '../helper/sync';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { clearAccounts } from '../store/reducers/accountSlice';
import {
  lockBase,
  setArchiveMode,
  setIsUnsaved,
  setSafeMode,
} from '../store/reducers/appSlice';
import { clearCategories } from '../store/reducers/categorySlice';
import { clearCurrencyData } from '../store/reducers/currencySlice';
import { clearTransactions } from '../store/reducers/transactionSlice';

import Icon from './Generic/Icon';

const Header: FC = () => {
  const navigate = useNavigate();

  const {
    safeMode, archiveMode, isUnsaved, vaultUrl, password, openedModalsCount,
  } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  const sync = async () => {
    if (!vaultUrl || !password) return;

    const data = aesEncrypt(JSON.stringify(getSyncData()), password);
    const response = await setBaseRequest(data, vaultUrl);
    if (!response) return;

    dispatch(setIsUnsaved(false));
    Swal.fire({ title: 'Synchronization is successful', icon: 'success' });
  };

  const lock = () => {
    dispatch(clearAccounts());
    dispatch(clearTransactions());
    dispatch(clearCategories());
    dispatch(lockBase());
    dispatch(clearCurrencyData());
    navigate('/decrypt');
  };

  const disableSafeMode = () => {
    Swal.fire({
      title: 'Show hidden data?',
      icon: 'warning',
      confirmButtonText: "Yes, I'm safe",
      showCancelButton: true,
      focusCancel: true,
    }).then((res) => {
      if (res.isConfirmed) {
        dispatch(setSafeMode(false));
      }
    });
  };

  const enableSafeMode = () => {
    dispatch(setSafeMode(true));
    Swal.fire({
      title: 'Safe mode is enabled',
      icon: 'success',
      timer: 1500,
    });
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
          onClick={safeMode ? disableSafeMode : enableSafeMode}
          className={classNames(safeMode && 'opacity-40')}
        >
          <Icon.Shield />
        </HeaderIconButton>

        <HeaderIconButton
          onClick={() => dispatch(setArchiveMode(!archiveMode))}
          className={classNames(!archiveMode && 'opacity-40')}
        >
          <Icon.Archive />
        </HeaderIconButton>

        <HeaderIconButton
          onClick={sync}
          className={classNames(!isUnsaved && 'opacity-40')}
        >
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
