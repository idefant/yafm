import { FC, ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { FlexGap, HStack } from '#ui/Stack';

import cls from './HeaderInfo.module.scss';

interface HeaderInfoProps {
  title: string;
  endAddition?: ReactNode;
  endAdditionGap?: FlexGap;
}

export const HeaderInfo: FC<HeaderInfoProps> = ({ title, endAddition, endAdditionGap }) => {
  const headerPortalElem = document.getElementById('headerPortal');

  if (!headerPortalElem) return null;

  return createPortal(
    <HStack gap={endAdditionGap} align="center">
      <div className={cls.title}>{title}</div>
      {endAddition}
    </HStack>,
    headerPortalElem,
  );
};
