import React, { useEffect, useState } from 'react';
import { getRows } from './adapters/main';
import CopyButton from './components/CopyButton';

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
    <ol>
    {
      rows && rows.map((row) => {
        const formatDescription = ({measurements, amount, info}) => {
          let result = '';
          const finalMeasures = measurements.replace(/( inches)|( in\.)|( in)/g, '')
          result += `Measures ${finalMeasures} inches,\n`
          result += amount > 1 ? `Set of ${amount},\n` : '';
          const infoArr = info.split(', ')
          for (let i = 0; i < infoArr.length; i++) {
            let text = infoArr[i];
            text = text.replaceAll('Sentiment', 'Shop name')
            result += `${text}${i === infoArr.length - 1 ? '' : ',\n'}`;
          }
          return result;
        }
        return <li key = {row.timestamp} className="card">
          <div className='section name'>
            <h2>{row.name}</h2>
            <CopyButton buttonText='Name' copyValue={row.name}></CopyButton>
            <hr />
          </div>

          <div className='section materials'>
            <h3>Materials</h3>
            <p>{row.materials}</p>
            <CopyButton buttonText='Materials' copyValue={row.materials}></CopyButton>
            <hr />
          </div>

          <div className='section description'>
            <h3>Description</h3>
            <pre>{formatDescription(row)}</pre>
            <CopyButton buttonText='Description' copyValue={formatDescription(row)}></CopyButton>
            <hr />
          </div>
          <div className='section weight'>
            <h3>Weight: {row.weight}</h3>
            <CopyButton buttonText='Weight' copyValue={row.weight}></CopyButton>
            <hr />
          </div>
          <p className='timestamp'>Posted: {row.timestamp}</p>
        </li>
      })
    }
    </ol>

  </div>
}

export default App;
