import { FC } from 'react';
import { Link } from 'react-router-dom';

import { appRoutes } from '#data/routes';

const Login: FC = () => (
  <div>
    <div>You need authorize</div>
    <Link reloadDocument to={appRoutes.oidcLogin}>
      Login with OpenID Connect
    </Link>
  </div>
);

export default Login;
