export const getRows = async () => {
  const data = await fetch('/api/v1/rows', {
    headers:{
        "accepts":"application/json"
    }
}).then(r => r.json());
  console.log('data: ', data);
}