'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { config } = require('../../config/index');
const MongoLib = require('../db/mongo');
const collection = 'users';
const mongoDB = new MongoLib();

module.exports = {
    login: async (root, { email, password }) => {
        const user = await mongoDB.findOne(collection, { email });
        if (!user) throw new Error('User does not exist!');

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) throw new Error(`Password is incorrect!`);

        const secret = config.secret;
        const token = jwt.sign({ _id: user._id, email: user.email }, secret, {
            expiresIn: '1h',
        });

        return { _id: user._id, token, tokenExpiration: 1 };
    },
};
