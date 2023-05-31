import { FC } from 'react';
import { Outlet } from 'react-router-dom';

const UnauthorizedTemplate: FC = () => (
  <div className="max-w-lg w-[512px] mx-auto my-16 border rounded-2xl border-slate-100/30 bg-slate-900 p-4">
    <Outlet />
  </div>
);

export default UnauthorizedTemplate;
