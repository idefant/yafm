import { FC } from 'react';
import { useAuth } from 'react-oidc-context';
import { Outlet } from 'react-router-dom';

import { useFetchBaseListQuery } from '#api/baseApi';
import Button, { ButtonLink } from '#ui/Button';

const CabinetTemplate: FC = () => {
  const { user, signoutRedirect } = useAuth();

  const { data: bases } = useFetchBaseListQuery();

  return (
    <div className="flex justify-center gap-4">
      <div className="max-w-lg w-60 my-16 border rounded-2xl border-slate-100/30 bg-slate-900 p-4">
        <div className="mt-1 mb-5">
          <div className="flex gap-3 justify-center font-semibold text-lg mb-1">
            <div>Username:</div>
            <div>{user?.profile.preferred_username}</div>
          </div>

          <div>
            <a
              className="block w-full mb-2 text-center"
              href={import.meta.env.VITE_ACCOUNT_URL}
              target="_blank"
              rel="noreferrer"
            >
              Account Settings
            </a>
          </div>
        </div>

        <ButtonLink to="/upload" className="block w-full mb-2 text-center" color="green">
          Upload Version
        </ButtonLink>
        {bases && bases.length > 1 && (
          <>
            <ButtonLink to="/versions" color="yellow" className="block w-full mb-2 text-center">
              Choose old version
            </ButtonLink>
            <ButtonLink to="/last" color="gray" className="block w-full mb-2 text-center">
              Open last version
            </ButtonLink>
          </>
        )}
        <hr className="m-4" />
        <Button color="gray" className="block w-full mb-2" onClick={() => signoutRedirect()}>
          Logout
        </Button>
      </div>
      <div className="max-w-lg w-[512px] my-16 border rounded-2xl border-slate-100/30 bg-slate-900 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default CabinetTemplate;
