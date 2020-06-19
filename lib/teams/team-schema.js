const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Team {
        _id: ID!
        name: String!
        owner: User
    }
`;

module.exports = typeDefs;
