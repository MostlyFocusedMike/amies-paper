import React, { useEffect, useState } from 'react';
import { getRows } from './adapters/main';

getRows();

const App = () => {
  const [rows, setRows] = useState(null)
  useEffect(() => {
    const loadRows = async () => {
      const rows = await getRows();
      console.log('hello/: ', );
      setRows(rows);
    }
    loadRows();
  }, []);

  return <div>
    <h1>Etsy Helper</h1>
    <ol style={{display: 'flex', flexWrap: 'wrap'}}>
    {
      rows && rows.map((row) => {
        console.log('row: ', row);
        const formatDescription = ({measurements, amount, info}) => {
          let result = '';
          const finalMeasures = measurements.replace(/( inches)|( in\.)|( in)/g, '')
          result += `Measures ${finalMeasures} inches,\n`
          result += amount > 1 ? `Set of ${amount},\n` : '';
          const infoArr = info.split(', ')
          for (let i = 0; i < infoArr.length; i++) {
            let text = infoArr[i];
            text = text.replaceAll('Sentiment', 'Shop name')
            // text = text.replaceAll("Stampin' Up Logo on back", "")
            result += `${text}${i === infoArr.length - 1 ? '' : ',\n'}`;
          }
          return result;
        }
        return <li key = {row.timestamp} className="card">
          <h2>Name:</h2>
          <input value={row.name} />
          <h3>Materials</h3>
          <input value={row.materials} />
          <h3>Description</h3>
          <textarea value={formatDescription(row)} />
          <h3>Weight</h3>
          <input value={row.weight}/>
        </li>
      })
    }
    </ol>

  </div>
}

export default App;
