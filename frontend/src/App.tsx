import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useIsAuthorizedQuery } from '#api/mainApi';
import { appRoutes } from '#data/routes';
import { useAppSelector } from '#hooks/reduxHooks';
import { Accounts } from '#pages/Accounts';
import { Categories } from '#pages/Categories';
import { Currencies } from '#pages/Currencies';
import { Dashboard } from '#pages/Dashboard';
import { Decrypt } from '#pages/Decrypt';
import { Forbidden } from '#pages/Forbidden';
import { Login } from '#pages/Login';
import { Setting } from '#pages/Setting';
import { Templates } from '#pages/Templates';
import { Transactions } from '#pages/Transactions';
import { Upload } from '#pages/Upload';
import { BaseTemplate } from '#templates/BaseTemplate';
import { CabinetTemplate } from '#templates/CabinetTemplate';

const App: FC = () => {
  const { isBaseUnlocked } = useAppSelector((state) => state.app);

  const {
    data: authData,
    isLoading: isLoadingAuthData,
    isUninitialized: isUninitializedAuthData,
    isError: isErrorAuthData,
  } = useIsAuthorizedQuery(undefined);

  if (isErrorAuthData) {
    return 'Error';
  }

  if (isLoadingAuthData || isUninitializedAuthData || !authData) {
    return 'Loading';
  }

  const routes = (() => {
    if (!authData.isAuth) {
      return (
        <>
          <Route path={appRoutes.login} element={<Login />} />
          <Route path={appRoutes.notFound} element={<Navigate to={appRoutes.login} />} />
        </>
      );
    }

    if (!authData.isUser) {
      return (
        <>
          <Route path={appRoutes.forbidden} element={<Forbidden />} />
          <Route path={appRoutes.notFound} element={<Navigate to={appRoutes.forbidden} />} />
        </>
      );
    }

    if (!isBaseUnlocked) {
      return (
        <Route element={<CabinetTemplate />}>
          <Route path={appRoutes.decrypt} element={<Decrypt />} />
          <Route path={appRoutes.upload} element={<Upload />} />
          <Route path={appRoutes.notFound} element={<Navigate to={appRoutes.decrypt} />} />
        </Route>
      );
    }

    return (
      <Route element={<BaseTemplate />}>
        <Route path={appRoutes.dashboard} element={<Dashboard />} />
        <Route path={appRoutes.transactions} element={<Transactions />} />
        <Route path={appRoutes.accounts} element={<Accounts />} />
        <Route path={appRoutes.settings} element={<Setting />} />
        <Route path={appRoutes.templates} element={<Templates />} />
        <Route path={appRoutes.categories} element={<Categories />} />
        <Route path={appRoutes.currencies} element={<Currencies />} />
        <Route path={appRoutes.notFound} element={<Navigate to={appRoutes.dashboard} />} />
      </Route>
    );
  })();

  return <Routes>{routes}</Routes>;
};

export default App;
