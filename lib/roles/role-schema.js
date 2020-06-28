const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Role {
        _id: ID!
        name: String!
    }
`;

module.exports = typeDefs;
