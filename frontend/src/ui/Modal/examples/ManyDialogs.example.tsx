import { FC } from 'react';

import { Button } from '#ui/Button';
import { dmodal } from '#ui/Modal';

const ManyDialogsExample: FC = () => {
  const openModal = (modalNumber: number) => {
    console.log(`${modalNumber} - modal opened`);
    dmodal({ title: `Модалка ${modalNumber}` }).then(({ status }) => {
      console.log(`${modalNumber} - modal closed (${status})`);
    });
  };

  const openModals = () => {
    const modalsCount = 20;
    let index = 0;

    const timer = setInterval(() => {
      index += 1;
      openModal(index);
      if (index === modalsCount) {
        clearInterval(timer);
      }
    }, 1000);
  };

  return <Button onClick={openModals}>Открыть все модальные окна</Button>;
};

export default ManyDialogsExample;
