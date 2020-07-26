const jwt = require('jsonwebtoken');
const { config } = require('../config/index');

const createAccessToken = (data) => {
    const secret = config.secret;
    return jwt.sign(data, secret, {
        expiresIn: '1h',
    });
};

const createRefreshToken = (data) => {
    const refreshKey = config.rfToken;
    return jwt.sign(data, refreshKey, {
        expiresIn: '7d',
    });
};

const sendRefreshToken = (res, refreshToken) => {
    return res.cookie('wtid', refreshToken, {
        httpOnly: true,
    });
};

module.exports = {
    createAccessToken,
    createRefreshToken,
    sendRefreshToken,
};
