import { FC } from 'react';
import { Link } from 'react-router-dom';

import { appRoutes } from '#data/routes';

export const Forbidden: FC = () => (
  <div>
    <div>
      У вас недостаточно прав для доступа к сервису. За более подробной информацией обратитесь к
      администратору
    </div>
    <Link reloadDocument to={appRoutes.oidcLogout}>
      Logout
    </Link>
  </div>
);
