'use strict';

const queries = require('./auth-queries');
const mutations = require('./auth-mutations');

const authResolver = {
    Query: queries,
    Mutation: mutations,
    Types: {},
};

delete authResolver.kind;
delete authResolver.loc;
delete authResolver.definitions;

module.exports = authResolver;
