'use strict';

const mutations = require('./link-mutations');
const queries = require('./link-queries');
const types = require('./link-types');

const linkResolver = {
    Query: queries,
    Mutation: mutations,
    Types: types,
};

delete linkResolver.kind;
delete linkResolver.loc;
delete linkResolver.definitions;

module.exports = linkResolver;
