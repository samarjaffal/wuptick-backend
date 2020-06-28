'use strict';

const mutations = require('./user-mutations');
const queries = require('./user-queries');
const types = require('./user-types');

const userResolver = {
    Query: queries,
    Mutation: mutations,
    Types: types,
};

delete userResolver.kind;
delete userResolver.loc;
delete userResolver.definitions;

module.exports = userResolver;
