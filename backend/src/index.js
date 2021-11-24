const express = require('express');
const path = require('path');
const Sheets = require('./sheets');

const app = express();

app.use((req, res, next) => {
  req.sheets = new Sheets();
  next();
});

app.use(express.json());
app.use('/', express.static(path.join(__dirname, '..', 'build')));
app.get('/api/v1/rows', async (req, res) => {
  const spreadsheets = await req.sheets.getRows();
  res.send(spreadsheets);
})

app.get('*', (req, res, next) => {
  console.log('req.originalUrl: ', req.originalUrl);
  if (req.originalUrl.includes('/api')) return next();
  return res.redirect('/');
});

const port = process.env.PORT || 80;
app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port 'http://localhost:${port}!`);
});