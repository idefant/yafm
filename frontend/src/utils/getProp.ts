import { Get, IfUnknown } from 'type-fest';

export const getProp = <BaseType, Path extends string, Default = undefined>(
  obj: BaseType,
  path: Path,
  defaultValue?: Default,
): string extends Path
  ? any
  : IfUnknown<
      Get<BaseType, Path, { strict: false }>,
      Default,
      Get<BaseType, Path, { strict: false }>
    > => {
  const propValue = path
    .split(/[/./[\]/'/"]/)
    .filter((prop) => prop)
    .reduce((innerObj: any, prop) => (innerObj ? innerObj[prop] : undefined), obj);

  return propValue !== undefined ? propValue : defaultValue;
};
