import { FC, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { refreshToken } from "../helper/jwt";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
  fetchFnG,
  fetchPrices,
} from "../store/actionCreators/currencyActionCreator";
import CabinetTemplate from "./Container/CabinetTemplate";
import PreLoginTemplate from "./Container/PreLoginTemplate";
import Accounts from "./Routes/Accounts";
import Categories from "./Routes/Categories";
import Decrypt from "./Routes/Decrypt";
import Login from "./Routes/Login";
import Main from "./Routes/Main";
import Setting from "./Routes/Setting/Setting";
import Templates from "./Routes/Templates";
import Transactions from "./Routes/Transactions";
import Upload from "./Routes/Upload";
import Versions from "./Routes/Versions";

const App: FC = () => {
  const {
    currency: { prices },
    user: { api, aesPass },
    app: { isUnsaved },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (api) {
      refreshToken(api);
    }
  }, [api]);

  useEffect(() => {
    window.onbeforeunload = () => (isUnsaved ? false : undefined);
  }, [isUnsaved]);

  useEffect(() => {
    if (aesPass && !prices) {
      dispatch(fetchPrices());
      dispatch(fetchFnG());
    }
  }, [aesPass, dispatch, prices]);

  return (
    <Routes>
      {!api ? (
        <>
          <Route element={<PreLoginTemplate />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      ) : !aesPass ? (
        <>
          <Route element={<PreLoginTemplate />}>
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
          <Route path="transactions/templates" element={<Templates />} />
          <Route
            path="/accounts/categories"
            element={<Categories categoryType="accounts" />}
          />
          <Route
            path="/transactions/categories"
            element={<Categories categoryType="transactions" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      )}
    </Routes>
  );
};

export default App;
