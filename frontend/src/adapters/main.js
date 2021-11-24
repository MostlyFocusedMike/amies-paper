export const getRows = async () => {
  const data = await fetch('/api/v1/rows', ).then(r => r.json());
  return data;
}