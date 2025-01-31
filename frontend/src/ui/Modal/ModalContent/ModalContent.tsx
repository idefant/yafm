import { FC, HTMLAttributes } from 'react';

interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {}

export const ModalContent: FC<ModalContentProps> = (props) => <div {...props} />;
