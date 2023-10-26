import { getPropValue } from './pathResolver';

const group = <T>(arr: T[], path: string) => {
  const group: Record<string | number, T[]> = {};

  arr.forEach((elem) => {
    const groupName = getPropValue(elem, path);
    if (!(groupName in group)) {
      group[groupName] = [];
    }
    group[groupName].push(elem);
  });

  return group;
};

export default group;
