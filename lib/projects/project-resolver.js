'use strict';

const mutations = require('./project-mutation');
const queries = require('./project-queries');
const types = require('./project-types');

const projectResolver = {
    Query: queries,
    Mutation: mutations,
    Types: types,
};

delete projectResolver.kind;
delete projectResolver.loc;
delete projectResolver.definitions;

module.exports = projectResolver;
