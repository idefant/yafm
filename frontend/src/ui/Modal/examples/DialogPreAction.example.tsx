import { FC, useCallback, useEffect } from 'react';

import { Button } from '#ui/Button';
import { dmodal } from '#ui/Modal';

const DialogPreActionExample: FC = () => {
  const openModal = useCallback(() => {
    dmodal({
      title: 'Заголовок модального окна',
      content: 'Это модальное окно вызывается функцией',
      disablePortal: true,
      cancelText: 'Закрыть',
      confirmText: 'Подтвердить',
      showCancel: true,
      showConfirm: true,
      preCancel: () => ({ result: 'cancelled' }),
      preConfirm: () =>
        new Promise<{ result: string; value: number }>((resolve) => {
          setTimeout(() => {
            resolve({ result: 'confirmed', value: Math.random() });
          }, 1000);
        }),
    }).then(({ status, value }) => {
      if (status === 'confirmed') {
        console.log(value);
      }
    });
  }, []);

  useEffect(() => {
    if (!import.meta.env.STORYBOOK_SCREENSHOT_MODE) return;
    openModal();
  }, [openModal]);

  return <Button onClick={openModal}>Открыть модальное окно</Button>;
};

export default DialogPreActionExample;
