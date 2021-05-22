const googledrive = require('../utils/googledrive');
const { config } = require('../config/index');
const {
    getUserFolders,
    initUserFolder,
    saveFolderForUser,
} = require('./gd-user-folders');

const initFolder = async (userId, userConfig, callback = null) => {
    try {
        if (userConfig !== null) return userConfig;
        const id = await initUserFolder(userId);
        if (!id) return false;
        if (callback) callback();
    } catch (error) {
        console.error(error);
        return new Error('Error on init user folder');
    }
};

/**
 * Upload a new file on folder.
 *
 * @param {String} userId The user id.
 * @param {String} folderName Folder name where the file will be uploaded.
 * @param {String} filePath The file path.
 */
const uploadFile = async (userId, folderName = 'default', filePath) => {
    try {
        //get user configuration folders
        const userConfig = await getUserFolders(userId);

        //init folder
        await initFolder(userId, userConfig, () =>
            uploadFile(userId, folderName, filePath)
        );

        const { folders } = userConfig;
        console.log(folders, 'folders');

        //get user folder id
        const folderId = await getUserFolderId(folders, folderName, userId);

        console.log(folderId, 'folderId');

        const fileName = 'test2.jpg';

        //upload file to google drive
        const response = await googledrive.uploadFile(
            fileName,
            filePath,
            folderId
        );

        console.log(response);
    } catch (error) {
        console.error(error);
        return new Error('Error on upload file to google drive');
    }
};

const getUserFolderId = async (folders, folderName, userId) => {
    let folderId;

    const folderExist = folders.hasOwnProperty(folderName);

    try {
        if (!folderExist) {
            console.log('no');

            //create folder on google drive
            folderId = await googledrive.createFolder(folderName);

            //if no id return null
            if (!folderId) return null;

            //save folder id on gd-user-folders table
            await saveFolderForUser(userId, folderName, folderId);
        } else {
            console.log('si');
            folderId = folders[folderName];
        }
    } catch (error) {
        console.error(error);
        return new Error('Error on get user folder id');
    }

    return folderId || null;
};

module.exports = { uploadFile };
