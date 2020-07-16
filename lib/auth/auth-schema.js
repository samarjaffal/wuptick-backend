const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type AuthData {
        _id: ID!
        token: String!
        tokenExpiration: Int!
    }

    extend type Query {
        "Login a User"
        login(email: String!, password: String!): AuthData
    }
`;

module.exports = typeDefs;
