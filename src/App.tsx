import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import Alert from "./Generic/Alert";
import Container from "./Generic/Container";
import Header from "./Header";
import Accounts from "./Routes/Accounts";
import Main from "./Routes/Main";
import Setting from "./Routes/Setting";
import Transactions from "./Routes/Transactions";

const App: FC = observer(() => {
  return (
    <div>
      <Header />
      <Container>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/setting" element={<Setting />} />
        </Routes>
      </Container>

      <Alert />
    </div>
  );
});

export default App;
