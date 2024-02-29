import classNames from 'classnames';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import Header from '#components/Header';
import Sidebar from '#components/Sidebar';
import { useAppSelector } from '#hooks/reduxHooks';

const BaseTemplate: FC = () => {
  const { openedModalsCount } = useAppSelector((state) => state.app);

  return (
    <div className="min-h-screen">
      <Header />
      <div>
        <Sidebar />
        <main className={classNames('flex-1 p-5 overflow-auto ml-60', openedModalsCount && 'blur')}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BaseTemplate;
