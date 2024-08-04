import { FC, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useAppSelector } from '#hooks/reduxHooks';
import Accounts from '#pages/Accounts';
import Categories from '#pages/Categories';
import Currencies from '#pages/Currencies';
import Dashboard from '#pages/Dashboard';
import Decrypt from '#pages/Decrypt';
import Setting from '#pages/Setting';
import Templates from '#pages/Templates';
import Transactions from '#pages/Transactions';
import Upload from '#pages/Upload';
import Versions from '#pages/Versions';
import BaseTemplate from '#templates/BaseTemplate';
import CabinetTemplate from '#templates/CabinetTemplate';

const App: FC = () => {
  const { isUnsaved, password } = useAppSelector((state) => state.app);

  useEffect(() => {
    window.onbeforeunload = () => (isUnsaved ? false : undefined);
  }, [isUnsaved]);

  return (
    <Routes>
      {!password ? (
        <>
          <Route element={<CabinetTemplate />}>
            <Route path="/decrypt/last" element={<Decrypt />} />
            <Route path="/decrypt/:versionId" element={<Decrypt />} />
            <Route path="/versions" element={<Versions />} />
            <Route path="/upload" element={<Upload />} />
          </Route>
          <Route path="*" element={<Navigate to="/decrypt/last" />} />
        </>
      ) : (
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
      )}
    </Routes>
  );
};

export default App;
