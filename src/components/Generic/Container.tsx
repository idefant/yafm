import { FC } from "react";

const Container: FC = ({ children }) => {
  return <div className="container mx-auto py-5 px-4">{children}</div>;
};

export default Container;
