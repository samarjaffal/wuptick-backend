'use strict';

const mutations = require('./comment-mutations');
const queries = require('./comment-queries');
const types = require('./comment-types');

const commentResolver = {
    Query: queries,
    Mutation: mutations,
    Types: types,
};

delete commentResolver.kind;
delete commentResolver.loc;
delete commentResolver.definitions;

module.exports = commentResolver;
