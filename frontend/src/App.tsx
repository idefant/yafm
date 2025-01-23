import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useIsAuthorizedQuery } from '#api/mainApi';
import { useAppSelector } from '#hooks/reduxHooks';
import Accounts from '#pages/Accounts';
import Categories from '#pages/Categories';
import Currencies from '#pages/Currencies';
import Dashboard from '#pages/Dashboard';
import Decrypt from '#pages/Decrypt';
import Forbidden from '#pages/Forbidden';
import Login from '#pages/Login';
import Setting from '#pages/Setting';
import Templates from '#pages/Templates';
import Transactions from '#pages/Transactions';
import Upload from '#pages/Upload';
import BaseTemplate from '#templates/BaseTemplate';
import CabinetTemplate from '#templates/CabinetTemplate';

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
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      );
    }

    if (!authData.isUser) {
      return (
        <>
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="*" element={<Navigate to="/forbidden" />} />
        </>
      );
    }

    if (!isBaseUnlocked) {
      return (
        <Route element={<CabinetTemplate />}>
          <Route path="/decrypt/last" element={<Decrypt />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="*" element={<Navigate to="/decrypt/last" />} />
        </Route>
      );
    }

    return (
      <Route element={<BaseTemplate />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/currencies" element={<Currencies />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    );
  })();

  return <Routes>{routes}</Routes>;
};

export default App;
