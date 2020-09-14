const jwt = require('jsonwebtoken');
const { config } = require('../config/index');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        req.isAuth = false;
        return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }

    let decodedToken;
    const secret = config.secret;
    try {
        decodedToken = jwt.verify(token, secret);
    } catch (error) {
        req.isAuth = false;
        return next();
    }

    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }

    req.isAuth = true;
    req._id = decodedToken._id;
    req.email = decodedToken.email;
    req.name = decodedToken.name;
    req.last_name = decodedToken.last_name;
    next();
};
