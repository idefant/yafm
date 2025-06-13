import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { appRoutes } from '#data/routes';
import { useAppSelector, useAppDispatch } from '#hooks/reduxHooks';
import { accountGroupsCleared } from '#store/reducers/accountGroupsSlice';
import { accountsCleared } from '#store/reducers/accountsSlice';
import { lockBase, setArchiveMode } from '#store/reducers/appSlice';
import { categoriesCleared } from '#store/reducers/categoriesSlice';
import { clearCommits } from '#store/reducers/commitsSlice';
import { currenciesCleared } from '#store/reducers/currenciesSlice';
import { templatesCleared } from '#store/reducers/templatesSlice';
import { transactionsCleared } from '#store/reducers/transactionsSlice';
import { Button } from '#ui/Button';
import { HStack } from '#ui/Stack';

import cls from './Header.module.scss';

export const Header: FC = () => {
  const navigate = useNavigate();

  const { archiveMode } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  const lock = () => {
    dispatch(currenciesCleared());
    dispatch(accountsCleared());
    dispatch(accountGroupsCleared());
    dispatch(transactionsCleared());
    dispatch(categoriesCleared());
    dispatch(templatesCleared());
    dispatch(clearCommits());
    dispatch(lockBase());
    navigate(appRoutes.decrypt);
  };

  const toggleArchive = () => dispatch(setArchiveMode(!archiveMode));

  return (
    <div className={cls.Header}>
      <div id="headerPortal" />
      <HStack>
        <Button onClick={toggleArchive}>{archiveMode ? 'Hide' : 'Show'} Archived</Button>
        <Button onClick={lock}>Lock</Button>
      </HStack>
    </div>
  );
};
