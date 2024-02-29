import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { useDeleteAccountMutation, useFetchInfoQuery } from '#api/userApi';
import { ChangePasswordModal } from '#components/Cabinet';
import { useAppDispatch } from '#hooks/reduxHooks';
import useModal from '#hooks/useModal';
import { logout } from '#store/reducers/userSlice';
import Button, { ButtonLink } from '#ui/Button';

const CabinetTemplate: FC = () => {
  const dispatch = useAppDispatch();

  const { data: user } = useFetchInfoQuery(undefined, { refetchOnMountOrArgChange: true });
  const [deleteAccount] = useDeleteAccountMutation();

  const changePasswordModal = useModal();

  return (
    <div className="flex justify-center gap-4">
      <div className="max-w-lg w-60 my-16 border rounded-2xl border-slate-100/30 bg-slate-900 p-4">
        <div className="flex gap-3 justify-center mt-1 mb-5 font-semibold text-lg">
          <div>Username:</div>
          <div>{user?.username}</div>
        </div>

        <ButtonLink to="/upload" className="block w-full mb-2 text-center" color="green">
          Upload Version
        </ButtonLink>
        {user && user.bases.length > 1 && (
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
        <Button color="gray" className="block w-full mb-2" onClick={changePasswordModal.open}>
          Change password
        </Button>
        <Button color="gray" className="block w-full mb-2" onClick={() => dispatch(logout())}>
          Logout
        </Button>
        <Button color="red" className="block w-full" onClick={deleteAccount}>
          Delete Account
        </Button>
      </div>
      <div className="max-w-lg w-[512px] my-16 border rounded-2xl border-slate-100/30 bg-slate-900 p-4">
        <Outlet />
      </div>

      <ChangePasswordModal isOpen={changePasswordModal.isOpen} close={changePasswordModal.close} />
    </div>
  );
};

export default CabinetTemplate;
