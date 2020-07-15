'use strict';

const mutations = require('./tag-mutations');
const queries = require('./tag-queries');
const types = require('./tag-types');

const tagResolver = {
    Query: queries,
    Mutation: mutations,
    Types: types,
};

delete tagResolver.kind;
delete tagResolver.loc;
delete tagResolver.definitions;

module.exports = tagResolver;
