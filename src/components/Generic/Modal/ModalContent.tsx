import { FC, ReactNode } from 'react';

interface ModalContentProps {
  children?: ReactNode;
}

const ModalContent: FC<ModalContentProps> = ({ children }) => (
  <div className="p-5">{children}</div>
);

export default ModalContent;
