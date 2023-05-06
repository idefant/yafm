const resolvePath = (object: any, path: string, defaultValue?: any) =>
  path
    .split(/[/./[\]/'/"]/)
    .filter((p) => p)
    .reduce((o, p) => (o ? o[p] : defaultValue), object);

export default resolvePath;
