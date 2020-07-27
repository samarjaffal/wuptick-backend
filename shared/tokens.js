const jwt = require('jsonwebtoken');
const { config } = require('../config/index');

const createAccessToken = (user) => {
    const secret = config.secret;
    return jwt.sign({ _id: user._id, email: user.email }, secret, {
        expiresIn: '20m',
    });
};

const createRefreshToken = (user) => {
    const refreshKey = config.rfToken;
    return jwt.sign(
        { _id: user._id, tk_version: !user.tk_version ? 0 : user.tk_version },
        refreshKey,
        {
            expiresIn: '7d',
        }
    );
};

const sendRefreshToken = (res, refreshToken) => {
    console.log(res, 'res');
    return res.cookie('wtid', refreshToken, {
        httpOnly: true,
    });
};

module.exports = {
    createAccessToken,
    createRefreshToken,
    sendRefreshToken,
};
