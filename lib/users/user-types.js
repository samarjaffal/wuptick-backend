const { gql } = require('apollo-server-express');

const typeDefs = gql`
    enum Status {
        active
        inactive
    }

    enum Level {
        developer
        admin
        user
    }

    type User {
        _id: ID!
        name: String!
        last_name: String
        email: String!
        password: String!
        occupation: String
        birthday: String
        status: Status
        avatar: String
        level: Level
    }

    type Query {
        "Retrieve all users"
        getUsers: [User]
    }

    input UserInput {
        name: String!
        last_name: String
        email: String!
        password: String!
        occupation: String
        birthday: String
        status: Status
        avatar: String
        level: Level
    }

    type Mutation {
        "Crate a User"
        createUser(input: UserInput!): User
    }
`;

module.exports = typeDefs;
