import { FC } from 'react';

import { useModal } from '#hooks/useModal';
import { Button } from '#ui/Button';
import { Modal, dmodal } from '#ui/Modal';

const InternalExample: FC = () => {
  const modal = useModal();

  const handleOpenSecondModal = () => {
    dmodal
      .error({
        title: 'Вторая модалка',
        confirmText: 'Третья модалка',
        cancelText: 'Закрыть текущее',
      })
      .then(({ isConfirmed }) => {
        if (!isConfirmed) return;
        dmodal.error({
          title: 'Третья модалка',
          cancelText: 'Закрыть текущее',
        });
      });
  };

  return (
    <>
      <Button onClick={modal.open}>Открыть модальное окно</Button>

      <Modal isOpen={modal.isOpen} close={modal.close} title="Первая модалка">
        <Modal.Footer>
          <Button color="secondary" onClick={modal.close}>
            Отмена
          </Button>
          <Button onClick={handleOpenSecondModal}>Вторая модалка</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InternalExample;
