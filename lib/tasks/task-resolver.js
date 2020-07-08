'use strict';

const mutations = require('./task-mutations');
const queries = require('./task-queries');
const types = require('./task-types');

const taskResolver = {
    Query: queries,
    Mutation: mutations,
    Types: types,
};

delete taskResolver.kind;
delete taskResolver.loc;
delete taskResolver.definitions;

module.exports = taskResolver;
