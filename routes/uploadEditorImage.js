const express = require('express');
const MongoLib = require('../lib/db/mongo');
const File = require('../helpers/file');
const { isValidToken } = require('../functions/auth');
const { ObjectID } = require('mongodb');
const { cloudinary } = require('../utils/cloudinary');

const uploadEditorImage = (app) => {
    const router = express.Router();
    app.use('/', router);
    router.use(express.json({ limit: '50mb' }));
    router.use(express.urlencoded({ limit: '50mb', extended: true }));

    router.post('/upload_editor_image', async (req, res) => {
        try {
            const fileStr = req.body.data;
            const token = req.body.token;
            const fileData = JSON.parse(req.body.fileData);

            const isValid = await isValidToken(token);

            if (!isValid) res.status(500).send('Unauthenticated');

            const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
                upload_preset: 'dev-tests',
            });

            await File.createFile({
                ...fileData,
                fileUrl: uploadedResponse.secure_url,
            });
            /* console.log(uploadedResponse, 'uploadedResponse'); */
            return res.send({
                success: 1,
                file: {
                    url: uploadedResponse.secure_url,
                    width: uploadedResponse.width,
                    height: uploadedResponse.height,
                },
            });
        } catch (error) {
            res.status(500).json({ success: 0, file: {} });
        }
    });
};

module.exports = uploadEditorImage;
