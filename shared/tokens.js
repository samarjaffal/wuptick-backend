const jwt = require('jsonwebtoken');
const { config } = require('../config/index');

const createAccessToken = (user) => {
    const secret = config.secret;
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            name: user.name,
            last_name: user.last_name,
            user_attempts: user.user_attempts,
        },
        secret,
        {
            expiresIn: '15m',
        }
    );
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

const createEmailToken = (data) => {
    const secret = config.emailSecret;
    return jwt.sign(
        {
            ...data,
        },
        secret,
        {
            expiresIn: '1d',
        }
    );
};

const sendRefreshToken = (res, refreshToken) => {
    //console.log(res, 'res');
    return res.cookie('wtid', refreshToken, {
        httpOnly: true,
    });
};

module.exports = {
    createAccessToken,
    createRefreshToken,
    createEmailToken,
    sendRefreshToken,
};
