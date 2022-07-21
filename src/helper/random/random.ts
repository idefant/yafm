export const genRanHex = (size: number) => (
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('')
);

export const genId = () => genRanHex(8);
