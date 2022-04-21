import { FC } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../Generic/Button";

const CategoriesOverview: FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Button onClick={() => navigate("/categories/account")} color="green">
        Account
      </Button>
      <Button onClick={() => navigate("/categories/transaction")}>
        Transaction
      </Button>
    </>
  );
};

export default CategoriesOverview;
