import { FC, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import store from "../../store";
import Container from "../Generic/Container";
import Header from "../Header";

const CabinetTemplate: FC = () => {
  const { api, aesPass } = store.user;
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
