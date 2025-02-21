import { FC, ReactNode } from 'react';
import { createPortal } from 'react-dom';

import ChevronLeft from '#svg/chevron-left.svg?react';
import { IconButton } from '#ui/IconButton';
import { FlexGap, HStack } from '#ui/Stack';

import cls from './HeaderInfo.module.scss';

interface HeaderInfoProps {
  title: string;
  endAddition?: ReactNode;
  endAdditionGap?: FlexGap;
  backUrl?: string;
}

export const HeaderInfo: FC<HeaderInfoProps> = ({
  title,
  endAddition,
  endAdditionGap,
  backUrl,
}) => {
  const headerPortalElem = document.getElementById('headerPortal');

  if (!headerPortalElem) return null;

  return createPortal(
    <HStack gap={endAdditionGap} align="center">
      <HStack align="center">
        {backUrl && (
          <IconButton
            icon={ChevronLeft}
            variant="text"
            color="default"
            size="lg"
            to={backUrl}
            className={cls.backButton}
          />
        )}
        <h2 className={cls.title}>{title}</h2>
      </HStack>
      {endAddition}
    </HStack>,
    headerPortalElem,
  );
};
