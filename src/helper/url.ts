export const isValidUrl = (string: string) => {
  try {
    const url = new URL(string);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};
