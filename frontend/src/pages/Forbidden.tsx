import { FC } from 'react';
import { Link } from 'react-router-dom';

const Forbidden: FC = () => (
  <div>
    <div>
      У вас недостаточно прав для доступа к сервису. За более подробной информацией обратитесь к
      администратору
    </div>
    <Link reloadDocument to="/api/auth/logout">
      Logout
    </Link>
  </div>
);

export default Forbidden;
