'use strict';

const mutations = require('./module-mutations');
const queries = require('./module-queries');
const types = require('./module-types');

const moduleResolver = {
    Query: queries,
    Mutation: mutations,
    Types: types,
};

delete moduleResolver.kind;
delete moduleResolver.loc;
delete moduleResolver.definitions;

module.exports = moduleResolver;
