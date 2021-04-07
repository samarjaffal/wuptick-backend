'use strict';

const mutations = require('./notification-mutations');
const queries = require('./notification-queries');
const types = require('./notification-queries');

const notificationResolver = {
    Query: queries,
    Mutation: mutations,
    Types: types,
};

delete notificationResolver.kind;
delete notificationResolver.loc;
delete notificationResolver.definitions;

module.exports = notificationResolver;
