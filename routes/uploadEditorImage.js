const express = require('express');
const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const uploadEditorImage = (app) => {
    const router = express.Router();
    app.use('/', router);
    router.use(express.json({ limit: '50mb' }));
    router.use(express.urlencoded({ limit: '50mb', extended: true }));
    router.post('/upload_editor_image', async (req, res) => {
        try {
            const fileStr = req.body.data;
            console.log(fileStr, 'fileStr');

            //return response
            return res.send({
                ok: true,
            });
        } catch (error) {}
    });
};

module.exports = uploadEditorImage;
