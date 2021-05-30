const googledrive = require('../utils/googledrive');
const { config } = require('../config/index');
const {
    getUserFolders,
    initUserFolder,
    saveFolderForUser,
} = require('./gd-user-folders');
const { file } = require('googleapis/build/src/apis/file');

const USER_ROOT_FOLDER_PREFIX = 'user-files';

/**
 * Check the configuration folders for a user
 *
 * @param {String} userId The user id.
 * @param {String} userConfig An object with the files configuration.
 * @param {String} callback Optional callback.
 */
const LIMIT_COUNT = 3;
const initFolderConf = async (userId, userConfig) => {
    try {
        if (userConfig !== null) return userConfig;
        const id = await initUserFolder(userId);
        return id || null;
        // if (count >= LIMIT_COUNT) return null;
        // if (callback) callback(count);
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
const uploadFile = async (
    userId,
    folderName = 'default',
    filePath,
    fileName,
    count = 0
) => {
    try {
        const errorResponse = { status_msg: 'error', status_id: -1 };

        const successResponse = { status_msg: 'success', status_id: 0 };

        //check number of attemps
        if (count >= 3) return errorResponse;

        count++;

        //get user configuration folders
        const userConfig = await getUserFolders(userId);

        // console.log(userConfig, 'userConfig');

        count++;

        //init folder
        if (userConfig == null) {
            const result = await initFolderConf(userId, userConfig);

            if (result !== null) {
                return uploadFile(
                    userId,
                    folderName,
                    filePath,
                    fileName,
                    count
                );
            }
        }

        const { folders } = userConfig;
        //console.log(folders, 'folders');

        //check if user has a root folder
        const userParentFolderId = await checkRootFolderForUser(
            folders,
            userId
        );

        //get user folder id
        const folderId = await getUserFolderId(
            folders,
            folderName,
            userId,
            userParentFolderId
        );

        //console.log(folderId, 'folderId');

        //upload file to google drive
        const response = await googledrive.uploadFile(
            fileName,
            filePath,
            folderId
        );

        //console.log(response);

        const { id: fileId } = response;

        const data = await googledrive.getFileLinks(fileId);

        const resultResponse = {
            ...successResponse,
            url: data.webContentLink,
            size: data.size,
        };

        return resultResponse;
    } catch (error) {
        console.error(error);
        return errorResponse;
    }
};

const checkRootFolderForUser = (folders, userId) => {
    try {
        const folderName = `${USER_ROOT_FOLDER_PREFIX}-${userId}`;
        return getUserFolderId(folders, folderName, userId);
    } catch (error) {
        console.error(error);
        return new Error('Error on check root folder for user');
    }
};

const getUserFolderId = async (
    folders,
    folderName,
    userId,
    parentFolder = config.gdRootFolderId
) => {
    let folderId;

    const folderExist = folders.hasOwnProperty(folderName);

    try {
        if (!folderExist) {
            // console.log('no');

            //create folder on google drive
            folderId = await googledrive.createFolder(folderName, parentFolder);

            //if no id return null
            if (!folderId) return null;

            //save folder id on gd-user-folders table
            await saveFolderForUser(userId, folderName, folderId);
        } else {
            //console.log('yes');
            folderId = folders[folderName];
        }
    } catch (error) {
        console.error(error);
        return new Error('Error on get user folder id');
    }

    return folderId || null;
};

module.exports = { uploadFile };
