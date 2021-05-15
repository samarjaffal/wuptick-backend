const { config } = require('../config/index');
const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');

const SCOPES = [
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
];

/**
 * Create an auth client with the given secret file, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
const authorize = () => {
    const auth = new GoogleAuth({
        keyFile: config.googleAuthSecretFile,
        scopes: SCOPES,
    });

    return auth;
};

const listFiles = async () => {
    const auth = await authorize();

    const drive = google.drive({ version: 'v3', auth });
    drive.files.list(
        {
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
        },
        async (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const files = res.data.files;
            if (files.length) {
                console.log('Files:');
                files.map((file) => {
                    console.log(`${file.name} (${file.id})`);
                });
            } else {
                console.log('No files found.');
            }
        }
    );
};

module.exports = { listFiles };
