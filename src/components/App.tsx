import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
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
  return (
    <Routes>
      <Route element={<PreLoginTemplate />}>
        <Route path="/login" element={<Login />} />
        <Route path="/decrypt" element={<Decrypt />} />
      </Route>

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
    </Routes>
  );
});

export default App;
