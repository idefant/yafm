import { autorun } from "mobx";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { refreshToken } from "../helper/jwt";
import { getPricesRequest } from "../helper/requests/currencyApiRequest";
import store from "../store";
import CabinetTemplate from "./Container/CabinetTemplate";
import PreLoginTemplate from "./Container/PreLoginTemplate";
import Accounts from "./Routes/Accounts";
import Categories from "./Routes/Categories";
import Decrypt from "./Routes/Decrypt";
import Login from "./Routes/Login";
import Main from "./Routes/Main";
import Setting from "./Routes/Setting";
import Templates from "./Routes/Templates";
import Transactions from "./Routes/Transactions";

const App: FC = observer(() => {
  const {
    user: { api, aesPass, accessToken },
  } = store;

  useEffect(() => {
    if (api) {
      refreshToken(api, accessToken);
    }
  }, [api, accessToken]);

  useEffect(
    () =>
      autorun(async () => {
        if (store.user.aesPass && !store.currency.prices) {
          const response = await getPricesRequest();
          if (!response) return;
          store.currency.setPrices(response.data.bitcoin);
        }
      }),
    []
  );

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
            <Route path="/decrypt" element={<Decrypt />} />
          </Route>
          <Route path="*" element={<Navigate to="/decrypt" />} />
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
});

export default App;
