import { AccountGroup } from '#types/accountGroupType';
import { dmodal } from '#ui/Modal';
import { actionCreator, committer } from '#utils/committer';

export const confirmAccountGroupDeletion = async (group: AccountGroup) => {
  const modalResult = await dmodal.error({
    title: 'Delete group',
    content: `Group name: ${group.name}`,
    confirmText: 'Delete',
    confirmColor: 'danger',
  });

  if (modalResult.isConfirmed) {
    committer(actionCreator.deleteAccountGroup(group.id)).sync();
  }
};
