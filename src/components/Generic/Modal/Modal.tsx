import classNames from 'classnames';
import FocusTrap from 'focus-trap-react';
import { FC, ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import ModalContent from './ModalContent';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';

interface ModalProps {
  isOpen: boolean;
  close?: () => void;
  onExited?: () => void;
  onEnter?: () => void;
  onSubmit?: any;
  width?: 'middle' | 'big' | 'biggest';
  children?: ReactNode;
}

interface ModalExtensions {
  Header: typeof ModalHeader;
  Content: typeof ModalContent;
  Footer: typeof ModalFooter;
}

const Modal: FC<ModalProps> & ModalExtensions = ({
  children,
  isOpen,
  close,
  onExited,
  onEnter,
  onSubmit,
  width = 'middle',
}) => {
  const Container = (onSubmit ? 'form' : 'div') as keyof JSX.IntrinsicElements;
  const [isActiveFocusTrap, setIsActiveFocusTrap] = useState(false);

  const widthClassnames = {
    middle: 'max-w-md',
    big: 'max-w-xl',
    biggest: 'max-w-3xl',
  };

  return createPortal(
    <CSSTransition
      in={isOpen}
      timeout={200}
      mountOnEnter
      unmountOnExit
      classNames={{
        enterActive: '!opacity-100',
        enterDone: '!opacity-100',
        exitActive: '!opacity-0',
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
              widthClassnames[width],
            )}
          >
            <Container
              className="bg-white flex flex-col overflow-hidden max-h-full rounded-lg"
              onClick={(e) => e.stopPropagation()}
              onSubmit={onSubmit}
            >
              {children}
            </Container>
          </div>
        </div>
      </FocusTrap>
    </CSSTransition>,
    document.body,
  );
};

Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

export default Modal;
