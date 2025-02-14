import { ComponentProps, FC } from 'react';

import { Button } from '#ui/Button';
import { Modal, useModal } from '#ui/Modal';
import { Paragraph } from '#ui/Typography';

type ModalExampleProps = Pick<
  ComponentProps<typeof Modal>,
  'title' | 'icon' | 'isOpen' | 'container' | 'disablePortal' | 'size' | 'showCloseButton'
>;

const ModalExample: FC<ModalExampleProps> = ({
  title,
  icon,
  size,
  showCloseButton,
  isOpen: isOpenByDefault,
  container,
  disablePortal,
}) => {
  const modal = useModal(isOpenByDefault);

  return (
    <>
      <Button onClick={modal.open}>Открыть модальное окно</Button>

      <Modal
        isOpen={modal.isOpen}
        close={modal.close}
        title={title}
        icon={icon}
        size={size}
        showCloseButton={showCloseButton}
        container={container}
        disablePortal={disablePortal}
      >
        <Modal.Content>
          <Paragraph gutterBottom>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit quia aliquid blanditiis
            quo ut rerum et doloribus repudiandae voluptatibus ea, ex praesentium quidem harum,
            labore perspiciatis molestias sint, dicta minus!
          </Paragraph>
        </Modal.Content>

        <Modal.Footer>
          <Button color="secondary" onClick={modal.close}>
            Отмена
          </Button>
          <Button onClick={modal.close}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalExample;
