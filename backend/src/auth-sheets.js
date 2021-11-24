const fs = require('fs');
const readlineSync = require('readline-sync');
const { google } = require('googleapis');
const path = require('path');

const TOKEN_PATH = path.join(__dirname,'..', 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, '..', 'credentials.json');

const saveTokensToFile = (tokens) => {
  try {
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens))
    console.log('Token stored to', TOKEN_PATH);
  } catch (err) {
    console.error("Can't save to file", err);
  }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
const getNewTokens = async (oAuth2Client) => {
  // If modifying scope, delete `token.json`. `token.json` stores the user's access/refresh tokens,
  // and is created automatically when the authorization flow completes for the first time.
  const scope = ['https://www.googleapis.com/auth/spreadsheets'];
  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope });
  console.log('Authorize this app by visiting this url:', authUrl);

  try {
    const code = readlineSync.question('Enter the code from that page here: ');
    const { tokens } = await oAuth2Client.getToken(code);
    return tokens;
  } catch (err) {
    console.error('Error while trying to retrieve access token', err);
  }
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
const authorize = async () => {
  let credentials;
  try {
    credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  } catch (err) {
    console.log('Error loading client secret file ----');
    throw new Error(err);
  }

  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  let tokens;
  const tokensExist = fs.existsSync(TOKEN_PATH);
  if (tokensExist) {
    tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
  } else {
    tokens = await getNewTokens(oAuth2Client);
    saveTokensToFile(tokens);
  }

  oAuth2Client.setCredentials(tokens);
  return oAuth2Client;
}

module.exports = authorize;