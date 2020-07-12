'use strict';

const mutations = require('./file-mutations');
const queries = require('./file-queries');
const types = require('./file-types');

const fileResolver = {
    Query: queries,
    Mutation: mutations,
    Types: types,
};

delete fileResolver.kind;
delete fileResolver.loc;
delete fileResolver.definitions;

module.exports = fileResolver;
