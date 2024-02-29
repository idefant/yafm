import { useState } from 'react';

import { decrementOpenedModalsCount, incrementOpenedModalsCount } from '#store/reducers/appSlice';

import { useAppDispatch, useAppSelector } from './reduxHooks';

const useModal = (isOpenDefault = false) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const dispatch = useAppDispatch();
  const { openedModalsCount } = useAppSelector((state) => state.app);

  const open = () => {
    if (openedModalsCount === 0) {
      const margin = window.innerWidth - document.body.scrollWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.marginRight = `${margin}px`;
    }
    setIsOpen(true);
    dispatch(incrementOpenedModalsCount());
  };

  const close = () => {
    if (openedModalsCount === 1) {
      document.body.style.overflow = 'auto';
      document.body.style.marginRight = '';
    }
    setIsOpen(false);
    dispatch(decrementOpenedModalsCount());
  };

  return {
    isOpen,
    open,
    close,
    setIsOpen,
  };
};

export default useModal;
