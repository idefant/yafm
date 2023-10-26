export const sum = (arr: number[]) => arr.reduce((sum, num) => sum + num, 0);

export const average = (arr: number[]) => sum(arr) / arr.length;
