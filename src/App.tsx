import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import Alert from "./Generic/Alert";
import Container from "./Generic/Container";
import Header from "./Header";
import Accounts from "./Routes/Accounts";
import Categories from "./Routes/Categories";
import Main from "./Routes/Main";
import Transactions from "./Routes/Transactions";

const App: FC = () => {
  return (
    <div>
      <Header />
      <Container>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </Container>

      <Alert />
    </div>
  );
};

export default App;
