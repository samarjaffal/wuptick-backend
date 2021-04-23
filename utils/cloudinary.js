const { config } = require('../config/index');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: config.cloudinaryName,
    api_key: config.clodinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
});

const uploadImage = async (imgString, uploadPresent, folder) => {
    const uploadedResponse = await cloudinary.uploader.upload(imgString, {
        upload_preset: uploadPresent,
        folder: folder,
    });

    return uploadedResponse;
};

module.exports = { cloudinary, uploadImage };
