export const exhaustiveCheck = (...props: never[]) => {
  if (props) throw new Error('Обработаны не все кейсы');
};
