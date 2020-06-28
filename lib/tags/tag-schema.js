const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Tag {
        _id: ID!
        name: String!
        color: String
        team: Team
    }
`;

module.exports = typeDefs;
