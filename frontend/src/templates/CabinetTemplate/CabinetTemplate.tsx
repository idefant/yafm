import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { useFetchProfileInfoQuery } from '#api/mainApi';
import { env } from '#data/env';
import { appRoutes } from '#data/routes';
import { Button } from '#ui/Button';
import { HStack, VStack } from '#ui/Stack';

export const CabinetTemplate: FC = () => {
  const { data: profile } = useFetchProfileInfoQuery(undefined);

  const accountUrl = env.OIDC_ACCOUNT_URL;

  return (
    <HStack gap={32}>
      <VStack>
        <HStack>
          <span>Username:</span>
          <span>{profile?.preferred_username || profile?.email}</span>
        </HStack>

        {accountUrl && (
          <Button to={accountUrl} target="_blank" rel="noreferrer">
            Account Settings
          </Button>
        )}

        <Button to={appRoutes.upload}>Upload Version</Button>
        <Button reloadDocument to={appRoutes.oidcLogout}>
          Logout
        </Button>
      </VStack>
      <div>
        <Outlet />
      </div>
    </HStack>
  );
};
