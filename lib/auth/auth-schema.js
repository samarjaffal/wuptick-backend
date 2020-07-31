const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type AuthData {
        _id: ID!
        token: String!
        tokenExpiration: Int!
    }

    input UserInput {
        email: String!
        password: String!
    }

    extend type Query {
        "Login a User"
        login(email: String!, password: String!): AuthData
    }

    extend type Mutation {
        "Crate a User"
        register(input: UserInput!): User
        "Logout a User"
        logout: Boolean
    }
`;

module.exports = typeDefs;
