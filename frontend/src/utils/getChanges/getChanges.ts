import { diff } from 'json-diff-ts';

import { isNullish } from '#utils/isNullish';

/**
 * Ищет разницу в объектах. Вложенные объекты проверяет только на 1 уровне.
 *
 * - Добавление свойства - присвоение ключу свойства
 * - Обновление свойства - присвоение ключу нового свойства
 * - Удаление свойства - присвоение ключу `null` в ответе
 *
 * `null` и `undefined` принимает за пустые значения
 */
export const getChanges = (
  oldObj: Record<string, any>,
  newObj: Record<string, any>,
  options?: { onlyKeys?: string[] },
): { isEmpty: true; value?: undefined } | { isEmpty: false; value: Record<string, any> } => {
  const onlyKeys = options?.onlyKeys;

  const diffList = diff(oldObj, newObj, { treatTypeChangeAsReplace: false });

  const filteredDiffList = onlyKeys
    ? diffList.filter((diffItem) => onlyKeys.includes(diffItem.key))
    : diffList;

  const changes = filteredDiffList
    .filter((change) => !(change.type === 'ADD' && isNullish(change.value)))
    .reduce<Record<string, any>>((acc, change) => {
      if (change.type === 'ADD') {
        acc[change.key] = newObj[change.key];
      }
      if (change.type === 'UPDATE') {
        if (
          !(
            'oldValue' in change &&
            'value' in change &&
            isNullish(change.oldValue) &&
            isNullish(change.value)
          )
        ) {
          acc[change.key] = newObj[change.key] ?? null;
        }
      }
      if (change.type === 'REMOVE') {
        if (!isNullish(change.value)) {
          acc[change.key] = null;
        }
      }
      return acc;
    }, {});

  const keys = Object.keys(changes).length;

  return keys === 0 ? { isEmpty: true } : { isEmpty: false, value: changes };
};
