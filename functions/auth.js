const jwt = require('jsonwebtoken');
const { config } = require('../config/index');

module.exports = {
    isValidToken: async (token) => {
        if (!token) return false;

        let decodedToken;
        const secret = config.secret;
        try {
            decodedToken = jwt.verify(token, secret);
        } catch (error) {
            return false;
        }

        if (!decodedToken) {
            return false;
        }

        return true;
    },
};
