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
        7: 'published',
        8: 'deleted'
    }
    this.numOfColumns = Object.keys(this.idxToKey).length;
  }

  spreadsheets = async () => {
    const auth = await authorize();
    const { spreadsheets } = google.sheets({version: 'v4', auth});
    return spreadsheets;
  }

  isDeleted = (row) => {
    const deletedIdx = 8;
    return !!row[deletedIdx]
  }

  // This deals with rows in an array (which is what google returns)
  convertIdxsToKeys = (rows, providedId = 0) => { // provided Id should def be updated so it's less brittle
      const final = []
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (this.isDeleted(row)) continue;
        const objRow = {};
        for (let i = 0; i < row.length; i++) {
          objRow[this.idxToKey[i]] = row[i];
        }
        objRow.id = (providedId) ? providedId : i + 2;
        final.push(objRow)
      }
      return final.reverse();
  }

  // this returns a single row
  convertKeysToIdxs = (rowObj) => {
    const result = [];
    for (let i = 0; i < this.numOfColumns; i++) {
      result.push(rowObj[this.idxToKey[i]]);
    }
    return result;
  }

  getRows = async (A1NotationRange = 'A2:I') => {
    const request = {
      spreadsheetId: this.sheetId,
      range: A1NotationRange,
    };

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

  updateRow = async (rowObj) => {
    const row = this.convertKeysToIdxs(rowObj);
    const A1NotationRange = `A${rowObj.id}:H`;
    const changedRow = await this.changeRowsUtil(A1NotationRange, [row], 'create')
    return this.convertIdxsToKeys(changedRow, rowObj.id)[0];
  }

  appendRows = async (rows, A1NotationRange = 'A:Z') => {
    return this.changeRowsUtil(A1NotationRange, rows, 'append')
  }
}

module.exports = SheetsWrapper;