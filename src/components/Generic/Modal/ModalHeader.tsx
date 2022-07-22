import { FC, ReactNode } from 'react';

import { CrossIcon } from '../../../assets/svg';

interface ModalHeaderProps {
  close?: () => void;
  children?: ReactNode;
}

const ModalHeader: FC<ModalHeaderProps> = ({ children, close }) => (
  <div className="flex justify-between p-5 border-b border-gray-600">
    <h2 className="text-xl font-bold">{children}</h2>
    {close && (
    <button onClick={close} type="button">
      <CrossIcon />
    </button>
    )}
  </div>
);

export default ModalHeader;
