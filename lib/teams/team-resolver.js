'use strict';

const mutations = require('./team-mutations');
const queries = require('./team-queries');
const types = require('./team-types');

const teamResolver = {
    Query: queries,
    Mutation: mutations,
    Types: types,
};

delete teamResolver.kind;
delete teamResolver.loc;
delete teamResolver.definitions;

module.exports = teamResolver;
