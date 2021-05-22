'use strict';

const mutations = require('./setting-mutations');
const queries = require('./setting-queries');
const types = require('./setting-types');

const settingResolver = {
    Query: queries,
    Mutation: mutations,
    Types: types,
};

delete settingResolver.kind;
delete settingResolver.loc;
delete settingResolver.definitions;

module.exports = settingResolver;
