import classNames from 'classnames';
import FocusTrap from 'focus-trap-react';
import { FC, ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import { CrossIcon } from '../../assets/svg';

interface ModalProps {
  isOpen: boolean;
  close?: () => void;
  onExited?: () => void;
  onEnter?: () => void;
  onSubmit?: any;
  width?: 'middle' | 'big' | 'biggest';
  children?: ReactNode;
}

const Modal: FC<ModalProps> = ({
  children,
  isOpen,
  close,
  onExited,
  onEnter,
  onSubmit,
  width = 'middle',
}) => {
  // eslint-disable-next-line no-undef
  const Tag = (onSubmit ? 'form' : 'div') as keyof JSX.IntrinsicElements;
  const [isActiveFocusTrap, setIsActiveFocusTrap] = useState(false);

  return createPortal(
    <CSSTransition
      in={isOpen}
      timeout={200}
      mountOnEnter
      unmountOnExit
      classNames={{
        enterActive: 'opacity-100',
        enterDone: 'opacity-100',
        exitActive: 'opacity-0',
      }}
      onExit={() => setIsActiveFocusTrap(false)}
      onExited={onExited}
      onEnter={onEnter}
      onEntered={() => setIsActiveFocusTrap(true)}
    >
      <FocusTrap focusTrapOptions={{ onDeactivate: close }} active={isActiveFocusTrap}>
        <div
          className="opacity-0 fixed inset-0 bg-gray-800/60 transition ease-in-out duration-200"
          onClick={close}
          aria-hidden="true"
        >
          <div
            className={classNames(
              'h-[calc(100%-3.5rem)] mx-auto my-7',
              width === 'middle' && 'max-w-md',
              width === 'big' && 'max-w-xl',
              width === 'biggest' && 'max-w-3xl',
            )}
          >
            <Tag
              className="bg-white flex flex-col overflow-hidden max-h-full rounded-lg"
              onClick={(e) => e.stopPropagation()}
              onSubmit={onSubmit}
            >
              {children}
            </Tag>
          </div>
        </div>
      </FocusTrap>
    </CSSTransition>,
    document.body,
  );
};

interface ModalHeaderProps {
  close?: () => void;
  children?: ReactNode;
}

export const ModalHeader: FC<ModalHeaderProps> = ({ children, close }) => (
  <div className="flex justify-between p-5 border-b border-gray-600">
    <h2 className="text-xl font-bold">{children}</h2>
    {close && (
    <button onClick={close} type="button">
      <CrossIcon />
    </button>
    )}
  </div>
);

export const ModalContent: FC<{ children?: ReactNode; }> = ({ children }) => (
  <div className="overflow-y-auto flex-1 p-5">{children}</div>
);

export const ModalFooter: FC<{ children?: ReactNode; }> = ({ children }) => (
  <div className="border-t border-gray-600 p-5 flex gap-4 justify-center">
    {children}
  </div>
);

export default Modal;
