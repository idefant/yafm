import { FC, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useAppSelector } from "../../hooks/reduxHooks";
import Container from "../Generic/Container";
import Header from "../Header";

const CabinetTemplate: FC = () => {
  const { api, aesPass } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!api) {
      navigate("/login");
    } else if (!aesPass) {
      navigate("/decrypt");
    }
  }, [api, aesPass, navigate]);

  return (
    <div>
      <Header />
      <Container>
        <Outlet />
      </Container>
    </div>
  );
};

export default CabinetTemplate;
