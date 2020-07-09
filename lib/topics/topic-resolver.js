'use strict';

const mutations = require('./topic-mutations');
const queries = require('./topic-queries');
const types = require('./topic-types');

const topicResolver = {
    Query: queries,
    Mutation: mutations,
    Types: types,
};

delete topicResolver.kind;
delete topicResolver.loc;
delete topicResolver.definitions;

module.exports = topicResolver;
