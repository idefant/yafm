import { FC } from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";
import { CrossIcon } from "../../assets/svg";

interface ModalProps {
  isOpen: boolean;
  close?: () => void;
  onExited?: () => void;
  onEnter?: () => void;
  contentTag?: string;
  onSubmit?: () => void;
}

const Modal: FC<ModalProps> = ({
  children,
  isOpen,
  close,
  onExited,
  onEnter,
  contentTag,
  onSubmit,
}) => {
  const Tag = (contentTag || "div") as keyof JSX.IntrinsicElements;

  return createPortal(
    <CSSTransition
      in={isOpen}
      timeout={300}
      mountOnEnter={true}
      unmountOnExit={true}
      classNames={{
        enter: "opacity-0",
        enterActive: "opacity-100",
        exitActive: "opacity-0",
      }}
      onExited={onExited}
      onEnter={onEnter}
    >
      <div
        className="fixed inset-0 bg-gray-800/60 transition ease-in-out duration-300"
        onClick={close}
      >
        <div className="h-[calc(100%-3.5rem)] max-w-md mx-auto my-7">
          <Tag
            className="bg-white flex flex-col overflow-hidden max-h-full rounded-lg"
            onClick={(e) => e.stopPropagation()}
            onSubmit={onSubmit}
          >
            {children}
          </Tag>
        </div>
      </div>
    </CSSTransition>,
    document.body
  );
};

interface ModalHeaderProps {
  close?: () => void;
}

export const ModalHeader: FC<ModalHeaderProps> = ({ children, close }) => {
  return (
    <div className="flex justify-between p-5 border-b border-gray-600">
      <h2 className="text-xl font-bold">{children}</h2>
      {close && (
        <button onClick={close}>
          <CrossIcon />
        </button>
      )}
    </div>
  );
};

export const ModalContent: FC = ({ children }) => {
  return <div className="overflow-y-auto flex-1 p-5">{children}</div>;
};

export const ModalFooter: FC = ({ children }) => {
  return (
    <div className="border-t border-gray-600 p-5 flex gap-4 justify-center">
      {children}
    </div>
  );
};

export default Modal;
