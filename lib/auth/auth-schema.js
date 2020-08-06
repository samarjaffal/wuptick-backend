const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type AuthData {
        _id: ID!
        token: String!
        tokenExpiration: Int!
    }

    interface Error {
        message: String!
    }

    type AuthUserError implements Error {
        message: String!
    }

    type AuthUserExistError implements Error {
        message: String!
    }

    input UserInput {
        email: String!
        password: String!
    }

    union AuthRegisterResult = User | AuthUserError | AuthUserExistError
    union AuthLoginResult = AuthData | AuthUserError

    extend type Query {
        "Login a User"
        login(email: String!, password: String!): AuthLoginResult!
    }

    extend type Mutation {
        "Crate a User"
        register(input: UserInput!): AuthRegisterResult!
        "Logout a User"
        logout: Boolean
    }
`;

module.exports = typeDefs;
