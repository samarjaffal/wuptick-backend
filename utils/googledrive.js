const { config } = require('../config/index');
const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');

const SCOPES = [
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.appdata',
];

const ROOT_FOLDER_ID = config.gdRootFolderId;

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

/**
 * List all the files.
 *
 */

const listFiles = () => {
    const auth = authorize();

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

/**
 * Creates a folder.
 * @param {String} folderName The name of the folder.
 * @param {String} parentId The folder parent id.
 *
 */

const createFolder = (folderName, parentId = ROOT_FOLDER_ID) => {
    const auth = authorize();
    const drive = google.drive({ version: 'v3', auth });

    var fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentId],
    };
    drive.files.create(
        {
            resource: fileMetadata,
            fields: 'id',
        },
        async function (err, file) {
            if (err) {
                // Handle error
                console.error(err);
            } else {
                console.log('Folder Id: ', file.data);
                const fileId = file.data.id;
            }
        }
    );
};

/**
 * Insert a new permission.
 *
 * @param {String} fileId ID of the file to insert permission for.
 * @param {String} value User or group e-mail address, domain name or
 *                       {@code null} "default" type.
 * @param {String} type The value "user", "group", "domain" or "default".
 * @param {String} role The value "owner", "writer" or "reader".
 */
const insertPermission = (fileId, email, type, role) => {
    const auth = authorize();
    const drive = google.drive({ version: 'v3', auth });

    const body = {
        emailAddress: email,
        type: type,
        role: role,
    };

    drive.permissions.create(
        {
            fileId: fileId,
            resource: body,
            transferOwnership: true,
            fields: 'id',
        },
        function (err, res) {
            if (err) {
                // Handle error...
                console.error(err);
            } else {
                console.log('Permission ID: ', res);
            }
        }
    );
};

module.exports = { listFiles, createFolder };
