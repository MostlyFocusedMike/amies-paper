import React, { useEffect, useState } from 'react';
import { getRows, updateRow } from './adapters/main';
import CopyButton from './components/CopyButton';

const App = () => {
  const [rows, setRows] = useState(null)
  useEffect(() => {
    const loadRows = async () => {
      const rows = await getRows();
      setRows(rows);
    };
    loadRows();
  }, []);

  const handleCheck = async (e) => {
    const newRows = [...rows];
    const row = rows[e.target.dataset.idx];
    row.published = e.target.checked;
    await updateRow(row);
    setRows(newRows);
  }

  return <div>
    <h1>Etsy Helper</h1>
    <ol>
    {
      rows && rows.map((row, idx) => {
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
          <p>{row.published ? 'Published' : 'Not Published'}</p>
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
          <input type='checkbox' checked={row.published || false} data-idx={idx} onChange={handleCheck} />
        </li>
      })
    }
    </ol>

  </div>
}

export default App;
