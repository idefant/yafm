import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../Header';
import Sidebar from '../Sidebar';

const CabinetTemplate: FC = () => (
  <div>
    <Header />
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-5 overflow-auto ml-60">
        <Outlet />
      </main>
    </div>
  </div>
);

export default CabinetTemplate;
