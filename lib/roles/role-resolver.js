'use strict';

const mutations = require('./role-mutations');
const queries = require('./role-queries');
const types = require('./role-types');

const roleResolver = {
    Query: queries,
    Mutation: mutations,
    Types: types,
};

delete roleResolver.kind;
delete roleResolver.loc;
delete roleResolver.definitions;

module.exports = roleResolver;
