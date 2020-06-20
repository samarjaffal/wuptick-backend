const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Task {
        _id: ID!
        name: String!
        description: String
    }
`;

module.exports = typeDefs;
