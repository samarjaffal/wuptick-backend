const mime = require('mime-types');
const fs = require('fs');
const { config } = require('../config/index');
const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const {
    getUserFolders,
    initUserFolder,
    saveFolderForUser,
} = require('../helpers/gd-user-folders');

//to remove
const path = require('path');

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

const createFolder = async (folderName, parentId = ROOT_FOLDER_ID) => {
    const auth = authorize();
    const drive = google.drive({ version: 'v3', auth });

    try {
        var fileMetadata = {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentId],
        };
        const response = await drive.files.create({
            resource: fileMetadata,
            fields: 'id',
        });

        const folderId = response.data.id;
        return folderId || null;
    } catch (error) {
        console.error(error, 'createFolder');
        return false;
    }
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
const insertPermission = async (fileId, type = 'anyone', role = 'reader') => {
    try {
        const auth = authorize();
        const drive = google.drive({ version: 'v3', auth });

        const body = {
            type: type,
            role: role,
        };

        const response = await drive.permissions.create({
            fileId: fileId,
            requestBody: body,
        });

        return response.data;
    } catch (error) {
        console.error(error, 'createFolder');
        return false;
    }
};

/**
 * Insert a new file on folder.
 *
 * @param {String} fileName File  name for the file.
 * @param {String} filePath Path where is located the file.
 * @param {String} parentId Parent folder where will be uploaded the file.
 */
const uploadFile = async (fileName, filePath, parentId) => {
    const auth = authorize();
    const drive = google.drive({ version: 'v3', auth });

    if (!parentId) return new Error('No parent folder found');
    if (!fileName) return new Error('No file name provided');
    if (!filePath) return new Error('File path was not provided');

    try {
        const fileMetadata = {
            name: fileName,
            parents: [parentId],
        };

        const media = {
            mimeType: mime.lookup(filePath),
            body: fs.createReadStream(filePath),
        };

        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });
        return response.data || null;
    } catch (error) {
        console.error(error);
        return new Error('Error when uploading file to google drive');
    }
};

const generatePublicUrl = async (fileId) => {
    const auth = authorize();
    const drive = google.drive({ version: 'v3', auth });

    try {
        const response = await drive.files.get({
            fileId,
            fields: 'webViewLink, webContentLink, size',
        });

        return response.data;
    } catch (error) {
        console.error(error, 'createFolder');
        return false;
    }
};

const getFileLinks = async (fileId) => {
    await insertPermission(fileId);
    const data = await generatePublicUrl(fileId);
    console.log(data, 'getFileLinks');
    return data;
};

module.exports = {
    listFiles,
    createFolder,
    uploadFile,
    insertPermission,
    generatePublicUrl,
    getFileLinks,
};
