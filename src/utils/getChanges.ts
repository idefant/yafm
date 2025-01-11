import { diff } from 'json-diff-ts';

export const getChanges = (oldObj: any, newObj: any, keys: string[] = Object.keys(newObj)) => {
  const changes = diff(oldObj, newObj, { treatTypeChangeAsReplace: false })
    .filter((change) => keys.includes(change.key))
    .filter((change) => !(change.type === 'ADD' && change.value === undefined));

  const actionData = changes.reduce<Record<string, any>>((acc, change) => {
    if (change.type === 'ADD') {
      acc[change.key] = newObj[change.key];
    }
    if (change.type === 'UPDATE') {
      acc[change.key] = newObj[change.key] ?? null;
    }
    if (change.type === 'REMOVE') {
      acc[change.key] = null;
    }
    return acc;
  }, {});

  return actionData;
};
