import { FC } from 'react';
import { Link, Outlet } from 'react-router-dom';

import { useFetchProfileInfoQuery } from '#api/mainApi';
import { appRoutes } from '#data/routes';
import { Button } from '#ui/Button';

const CabinetTemplate: FC = () => {
  const { data: profile } = useFetchProfileInfoQuery(undefined);

  const accountUrl = import.meta.env.VITE_ACCOUNT_URL;

  return (
    <div className="flex justify-center gap-4">
      <div className="max-w-lg w-60 my-16 border rounded-2xl border-slate-100/30 bg-slate-900 p-4">
        <div className="mt-1 mb-5">
          <div className="flex gap-3 justify-center font-semibold text-lg mb-1">
            <div>Username:</div>
            <div>{profile?.preferred_username || profile?.email}</div>
          </div>

          {accountUrl && (
            <div>
              <a
                className="block w-full mb-2 text-center"
                href={accountUrl}
                target="_blank"
                rel="noreferrer"
              >
                Account Settings
              </a>
            </div>
          )}
        </div>

        <Button to={appRoutes.upload}>Upload Version</Button>
        <hr className="m-4" />
        <Link reloadDocument to={appRoutes.oidcLogout}>
          Logout
        </Link>
      </div>
      <div className="max-w-lg w-[512px] my-16 border rounded-2xl border-slate-100/30 bg-slate-900 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default CabinetTemplate;
