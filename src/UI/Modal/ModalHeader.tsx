import { FC, ReactNode } from 'react';

import Icon from '../Icon';

interface ModalHeaderProps {
  close?: () => void;
  children?: ReactNode;
}

const ModalHeader: FC<ModalHeaderProps> = ({ children, close }) => (
  <div className="flex justify-between p-5 border-b border-gray-600">
    <h2 className="text-xl font-bold">{children}</h2>
    {close && (
      <button onClick={close} type="button" aria-label="close modal">
        <Icon.Cross />
      </button>
    )}
  </div>
);

export default ModalHeader;
