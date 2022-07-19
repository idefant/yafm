import { FC, ReactNode } from 'react';

const Container: FC<{ children?: ReactNode }> = ({ children }) => (
  <div className="container mx-auto py-5 px-4">{children}</div>
);

export default Container;
