import classNames from 'classnames';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { useAppSelector } from '../../hooks/reduxHooks';
import Header from '../Header';
import Sidebar from '../Sidebar';

const CabinetTemplate: FC = () => {
  const { openedModalsCount } = useAppSelector((state) => state.app);

  return (
    <div className="min-h-screen">
      <Header />
      <div>
        <Sidebar />
        <main
          className={classNames(
            'flex-1 p-5 overflow-auto ml-60',
            openedModalsCount && 'blur',
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CabinetTemplate;
