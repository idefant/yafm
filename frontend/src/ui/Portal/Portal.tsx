import { FC, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  container?: Element | DocumentFragment;
  disablePortal?: boolean;
}

export const Portal: FC<PortalProps> = ({
  children,
  container = document.body,
  disablePortal = false,
}) => {
  if (disablePortal) return children;
  return createPortal(children, container);
};
