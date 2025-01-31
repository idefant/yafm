import classNames from 'classnames';
import { FC } from 'react';

import { HStack, HStackProps } from '#ui/Stack';

import cls from './ModalFooter.module.scss';

interface ModalFooterProps extends HStackProps {}

export const ModalFooter: FC<ModalFooterProps> = ({ className, ...props }) => (
  <HStack justify="end" className={classNames(cls.ModalFooter, className)} {...props} />
);
