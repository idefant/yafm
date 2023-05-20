export const getPropValue = (obj: any, path: string, defaultValue?: any) =>
  path
    .split(/[/./[\]/'/"]/)
    .filter((prop) => prop)
    .reduce((innerObj, prop) => (innerObj ? innerObj[prop] : defaultValue), obj);
