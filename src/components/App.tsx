import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import CabinetTemplate from "./Container/CabinetTemplate";
import PreLoginTemplate from "./Container/PreLoginTemplate";
import Accounts from "./Routes/Accounts";
import CategoriesOverview from "./Routes/Categories/CategoriesOverview";
import Categories from "./Routes/Categories/Categories";
import Decrypt from "./Routes/Decrypt";
import Login from "./Routes/Login";
import Main from "./Routes/Main";
import Setting from "./Routes/Setting";
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
        <Route path="/categories" element={<CategoriesOverview />} />
        <Route
          path="/categories/account"
          element={<Categories categoryType="accounts" />}
        />
        <Route
          path="/categories/transaction"
          element={<Categories categoryType="transactions" />}
        />
      </Route>
    </Routes>
  );
});

export default App;
