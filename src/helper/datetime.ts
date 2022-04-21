export const getDateText = (unix: number) => {
  const date = new Date(unix);

  return date.toLocaleString("ru", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const getTimeText = (unix: number) => {
  const date = new Date(unix);

  return date.toLocaleString("ru", {
    hour: "numeric",
    minute: "numeric",
  });
};
