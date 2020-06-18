'use strict';

const userResolver = require('./users/user-resolver');

const resolvers = {
    ...userResolver,
};

module.exports = resolvers;
