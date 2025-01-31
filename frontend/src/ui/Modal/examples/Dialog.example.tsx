import { FC, useCallback, useEffect } from 'react';

import { Button } from '#ui/Button';
import { dmodal } from '#ui/Modal';

const DialogExample: FC = () => {
  const openModal = useCallback(() => {
    dmodal({
      title: 'Заголовок модального окна',
      content: 'Это модальное окно вызывается функцией',
      disablePortal: true,
      cancelText: 'Закрыть',
      confirmText: 'Подтвердить',
      showCancel: true,
      showConfirm: true,
    }).then(({ status }) => {
      console.log(status);
    });
  }, []);

  useEffect(() => {
    if (!import.meta.env.STORYBOOK_SCREENSHOT_MODE) return;
    openModal();
  }, [openModal]);

  return <Button onClick={openModal}>Открыть модальное окно</Button>;
};

export default DialogExample;
