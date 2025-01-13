import { type ReactNode, useEffect, useState } from 'react';
import { hasAuthParams, useAuth } from 'react-oidc-context';

import Alert from '#ui/Alert';

interface ProtectedAppProps {
  children: ReactNode;
}

export const ProtectedApp: React.FC<ProtectedAppProps> = (props) => {
  const { children } = props;

  const auth = useAuth();
  const [hasTriedSignin, setHasTriedSignin] = useState(false);

  useEffect(() => {
    if (
      !(
        hasAuthParams() ||
        auth.isAuthenticated ||
        auth.activeNavigator ||
        auth.isLoading ||
        hasTriedSignin
      )
    ) {
      // eslint-disable-next-line no-void
      void auth.signinRedirect();
      setHasTriedSignin(true);
    }
  }, [auth, hasTriedSignin]);

  if (auth.error) {
    return (
      <>
        <h1>We&apos;ve hit a snag</h1>
        <Alert variant="error">{auth.error?.message}</Alert>
      </>
    );
  }

  if (auth.isLoading) {
    <h1>Loading...</h1>;
  }

  if (auth.isAuthenticated) {
    return children;
  }

  return (
    <>
      <h1>We&apos;ve hit a snag</h1>
      <Alert variant="error">Unable to sign in</Alert>
    </>
  );
};
