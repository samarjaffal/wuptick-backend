const express = require('express');
const multer = require('multer');
const path = require('path');
const File = require('../helpers/file');
const { unlink } = require('fs').promises;
const { isValidToken } = require('../functions/auth');
const { cloudinary } = require('../utils/cloudinary');
const { uploadFile } = require('../helpers/gd-files-upload');

const uploadEditorFile = (app) => {
    const router = express.Router();
    app.use('/', router);
    router.use(express.json({ limit: '50mb' }));
    router.use(express.urlencoded({ limit: '50mb', extended: true }));

    let fileName,
        filesFolder = 'uploads/tmp/';

    //set storage to save file
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, filesFolder);
        },
        filename: function (req, file, cb) {
            fileName = `${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        },
    });

    //assign the storage variable to multer
    const upload = multer({ storage: storage });

    router.post(
        '/upload_editor_file',
        upload.single('file'),
        async (req, res) => {
            try {
                const file = req.file;
                let { data: fileData } = req.body;
                const successResponse = {
                    success: 1,
                    file: {},
                };
                const errorResponse = { success: 0, file: {} };

                fileData = JSON.parse(fileData);
                const {
                    parentId,
                    parentUrl,
                    owner,
                    additional_params,
                    token,
                } = fileData;

                const isValid = checkIfAuthenticated(token);
                if (!isValid) return res.json(errorResponse);

                const userId = '5ede1e7d2acb276b2d814bc4';

                const response = await uploadToGoogleDrive({
                    userId,
                    filePath: file.path,
                    fileName,
                });

                const isFileUploaded =
                    Object.keys(response).length > 0 && response.status_id == 0;

                if (!isFileUploaded) {
                    return res.status(500).json(errorResponse);
                }

                deleteTempFile(file.path);

                //store file on files table
                const { url, size } = response;

                await File.createFile({
                    parentId,
                    parentUrl,
                    owner,
                    additional_params,
                    fileName,
                    fileUrl: url,
                });

                /* console.log(uploadedResponse, 'uploadedResponse'); */
                return res.send({
                    ...successResponse,
                    file: {
                        url,
                        name: fileName,
                        size,
                    },
                });
            } catch (error) {
                console.log(error, 'error');
                return res.status(500).json({ success: 0, file: {} });
            }
        }
    );
};

const checkIfAuthenticated = async (token) => {
    if (!token) return res.json(errorResponse);
    const isValid = await isValidToken(token);
    return isValid;
};

const deleteTempFile = async (filePath) => {
    await unlink(filePath);
    console.log(`successfully deleted file: ${filePath}`);
};

const uploadToGoogleDrive = async ({ userId, filePath, fileName }) => {
    try {
        const folder = 'editor-files';
        const response = await uploadFile(userId, folder, filePath, fileName);
        return response;
    } catch (error) {
        console.log(error);
        return new Error('Error on uploadToGoogleDrive()');
    }
};

module.exports = uploadEditorFile;
