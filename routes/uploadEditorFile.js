const express = require('express');
const multer = require('multer');
const path = require('path');
const File = require('../helpers/file');
const { unlink } = require('fs').promises;
const { isValidToken } = require('../functions/auth');
const { cloudinary } = require('../utils/cloudinary');

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

                fileData = JSON.parse(fileData);
                const token = fileData.token;

                if (!token) return res.json({ success: 0, file: {} });
                const isValid = await isValidToken(token);

                if (!isValid) return res.json({ success: 0, file: {} });

                //upload file to cloud
                const uploadPreset = 'dev-tests';
                const folder = `${uploadPreset}\/user-5ede1e7d2acb276b2d814bc4/files/`;

                const response = await cloudinary.uploader.upload(file.path, {
                    upload_preset: uploadPreset,
                    folder: folder,
                    resource_type: 'raw',
                    use_filename: true,
                });

                const { url, bytes } = response;

                if (url) {
                    await unlink(file.path);
                    console.log(`successfully deleted file: ${fileName}`);
                }

                /* await File.createFile({
                    ...fileData,
                    fileUrl: uploadedResponse.secure_url,
                }); */
                /* console.log(uploadedResponse, 'uploadedResponse'); */
                return res.send({
                    success: 1,
                    file: {
                        url: url,
                        name: fileName,
                        size: bytes,
                    },
                });
            } catch (error) {
                console.log(error, 'error');
                return res.status(500).json({ success: 0, file: {} });
            }
        }
    );
};

module.exports = uploadEditorFile;
