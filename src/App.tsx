import { FC, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Swal from 'sweetalert2';

import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import Accounts from './pages/Accounts';
import Categories from './pages/Categories';
import Dashboard from './pages/Dashboard';
import Decrypt from './pages/Decrypt';
import Setting from './pages/Setting';
import Templates from './pages/Templates';
import Transactions from './pages/Transactions';
import Upload from './pages/Upload';
import Versions from './pages/Versions';
import { fetchVaultInfo } from './store/actionCreators/appActionCreator';
import { setVaultUrl } from './store/reducers/appSlice';
import CabinetTemplate from './templates/CabinetTemplate';
import EntranceTemplate from './templates/EntranceTemplate';
import { isValidUrl } from './utils/url';

const App: FC = () => {
  const {
    app: { isUnsaved, password, vaultUrl, isVaultWorking },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const defaultVaultUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    window.onbeforeunload = () => (isUnsaved ? false : undefined);
  }, [isUnsaved]);

  useEffect(() => {
    if (isVaultWorking !== undefined) return;

    dispatch(fetchVaultInfo(vaultUrl))
      .unwrap()
      .catch(() => {
        Swal.fire({
          title: 'Unable to connect to vault',
          text: 'Check the operation of the vault and URL',
          input: 'text',
          inputPlaceholder: defaultVaultUrl,
          inputValue: vaultUrl,
          confirmButtonText: 'Check URL',
          allowOutsideClick: false,
          preConfirm: (url) => {
            if (!isValidUrl(url)) {
              Swal.showValidationMessage('Wrong URL');
            } else {
              dispatch(setVaultUrl(url));
            }
          },
        });
      });
  }, [dispatch, vaultUrl, isVaultWorking, defaultVaultUrl]);

  return (
    <Routes>
      {!password ? (
        <>
          <Route element={<EntranceTemplate />}>
            <Route path="/decrypt/last" element={<Decrypt />} />
            <Route path="/decrypt/:versionId" element={<Decrypt />} />
            <Route path="/versions" element={<Versions />} />
            <Route path="/upload" element={<Upload />} />
          </Route>
          <Route path="*" element={<Navigate to="/decrypt/last" />} />
        </>
      ) : (
        <Route element={<CabinetTemplate />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="templates" element={<Templates />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      )}
    </Routes>
  );
};

export default App;
