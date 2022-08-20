import { FC, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Swal from 'sweetalert2';

import { isValidUrl } from '../helper/url';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchVaultInfo } from '../store/actionCreators/appActionCreator';
import {
  fetchFnG,
  fetchPrices,
} from '../store/actionCreators/currencyActionCreator';
import { setVaultUrl } from '../store/reducers/appSlice';

import CabinetTemplate from './Container/CabinetTemplate';
import EntranceTemplate from './Container/EntranceTemplate';
import Accounts from './Routes/Accounts';
import Categories from './Routes/Categories';
import Decrypt from './Routes/Decrypt';
import Main from './Routes/Main';
import Setting from './Routes/Setting/Setting';
import Templates from './Routes/Templates';
import Transactions from './Routes/Transactions';
import Upload from './Routes/Upload';
import Versions from './Routes/Versions';

const App: FC = () => {
  const {
    currency: { prices },
    app: {
      isUnsaved, password, vaultUrl, isVaultWorking,
    },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const defaultVaultUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    window.onbeforeunload = () => (isUnsaved ? false : undefined);
  }, [isUnsaved]);

  useEffect(() => {
    if (password && !prices) {
      dispatch(fetchPrices());
      dispatch(fetchFnG());
    }
  }, [dispatch, prices, password]);

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
          <Route path="/" element={<Main />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="templates" element={<Templates />} />
          <Route
            path="/categories/accounts"
            element={<Categories categoryType="accounts" />}
          />
          <Route
            path="/categories/transactions"
            element={<Categories categoryType="transactions" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      )}
    </Routes>
  );
};

export default App;
