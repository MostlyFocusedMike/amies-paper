const { google } = require('googleapis');
const authorize = require('./auth-sheets')

class SheetsWrapper {
  constructor() {
    // this.sheetId = '1fXKCP8H9-rdLKg-WRS9PcOVeLWFMrwS2QlMkR-QSYkk';
    this.sheetId = '1aXu0bNh1kAmhDgLyjFQfHR1OmClwwTdiOUkRcmzfHSA'; // testing
    this.idxToKey = {
        0: 'timestamp',
        1: 'name',
        2: 'materials',
        3: 'measurements',
        4: 'amount',
        5: 'info',
        6: 'weight',
    }
  }

  spreadsheets = async () => {
    const auth = await authorize();
    const { spreadsheets } = google.sheets({version: 'v4', auth});
    return spreadsheets;
  }

  convertIdxsToKeys = (rows) => {
      const final = []
      for (const row of rows) {
        const objRow = {};
        for (let i = 0; i < row.length; i++) {
          objRow[this.idxToKey[i]] = row[i]
        }
        final.push(objRow)
      }
      return final.reverse();
  }

  getRows = async (A1NotationRange = 'A2:G') => {
    const request = {
      spreadsheetId: this.sheetId,
      range: A1NotationRange,
    }

    const sheets = await this.spreadsheets()
    const {data: { values }} = await sheets.values.get(request);
    return this.convertIdxsToKeys(values);
  }

  changeRowsUtil = async (A1NotationRange, rows, type) => {
    const request = {
      spreadsheetId: this.sheetId,
      range: A1NotationRange,
      valueInputOption: 'USER_ENTERED',

      resource: {
        majorDimension: 'ROWS',
        values: rows
      },
    }

    const sheets = await this.spreadsheets()
    const { config: { data: { values } } } = type === 'create'
      ? await sheets.values.update(request)
      : await sheets.values.append(request);

    return values
  }

  updateRows = async (A1NotationRange, rows) => {
    return this.changeRowsUtil(A1NotationRange, rows, 'create')
  }

  appendRows = async (rows, A1NotationRange = 'A:Z') => {
    return this.changeRowsUtil(A1NotationRange, rows, 'append')
  }
}

module.exports = SheetsWrapper;