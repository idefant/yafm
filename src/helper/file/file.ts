export const exportFile = (
  data: string,
  filename: string,
  filetype?: string,
) => {
  const blob = new Blob([data], { type: filetype });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}`;
  link.click();
};

export const readFileContent = (file: File) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (event) => resolve(event.target?.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};
