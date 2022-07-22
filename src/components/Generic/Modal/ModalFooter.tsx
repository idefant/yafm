import { FC, ReactNode } from 'react';

interface ModalFooterProps {
  children?: ReactNode;
}

const ModalFooter: FC<ModalFooterProps> = ({ children }) => (
  <div className="border-t border-gray-600 p-5 flex gap-4 justify-center">
    {children}
  </div>
);

export default ModalFooter;
