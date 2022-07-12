import { FC, ReactNode } from "react";

export const Title: FC<{ children?: ReactNode }> = ({ children }) => (
  <h1 className="text-3xl font-bold underline text-center mb-4">{children}</h1>
);
