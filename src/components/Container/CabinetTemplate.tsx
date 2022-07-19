import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import Container from '../Generic/Container';
import Header from '../Header';

const CabinetTemplate: FC = () => (
  <div>
    <Header />
    <Container>
      <Outlet />
    </Container>
  </div>
);

export default CabinetTemplate;
