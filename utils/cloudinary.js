const { config } = require('../config/index');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: config.cloudinaryName,
    api_key: config.clodinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
});

module.exports = { cloudinary };
