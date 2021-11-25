export const getRows = async () => {
  const data = await fetch('/api/v1/rows', ).then(r => r.json());
  return data;
}

export const updateRow = async (rowObj) => {
  const data = await fetch(`/api/v1/rows/${rowObj.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rowObj),
  }).then(r => r.json());
  return data;
}