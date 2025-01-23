import { FC } from 'react';
import { Link } from 'react-router-dom';

const Login: FC = () => (
  <div>
    <div>You need authorize</div>
    <Link reloadDocument to="/api/auth/login">
      Login with OpenID Connect
    </Link>
  </div>
);

export default Login;
