const { gql } = require('apollo-server-express');

const typeDefs = gql`
    enum Status {
        active
        inactive
        on_hold
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
        teams: [Team]
        projects: [Project]
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
        "Add Teams To User"
        addTeam(userId: ID!, teamId: ID!): User
        "Add Projects To User"
        addProject(userId: ID!, projectId: ID!): User
    }
`;

module.exports = typeDefs;
