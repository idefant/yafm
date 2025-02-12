import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from '#components/Header';
import { Sidebar } from '#components/Sidebar';

import cls from './BaseTemplate.module.scss';

export const BaseTemplate: FC = () => (
  <div className={cls.BaseTemplate}>
    <Sidebar />
    <div className={cls.content}>
      <Header />
      <main className={cls.main}>
        <Outlet />
      </main>
    </div>
  </div>
);
