'use strict';

const mutations = require('./invitation-mutation');
const queries = require('./invitation-queries');
const types = {};

const invitationResolver = {
    Query: queries,
    Mutation: mutations,
    Types: types,
};

delete invitationResolver.kind;
delete invitationResolver.loc;
delete invitationResolver.definitions;

module.exports = invitationResolver;
