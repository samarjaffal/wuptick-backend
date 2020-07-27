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
        password: String
        occupation: String
        birthday: String!
        status: Status
        avatar: String
        level: Level
        tk_version: Int
        teams: [Team]
        favorite_projects: [Project]
        favorite_tasks: [Task]
    }

    type UserProject {
        project: Project
        favorite: Boolean
    }

    type Query {
        "Retrieve all users"
        getUsers: [User]
    }

    input EditUserInput {
        name: String
        last_name: String
        email: String
        password: String
        occupation: String
        birthday: String
        status: Status
        avatar: String
        level: Level
        tk_version: Int
    }

    type Mutation {
        "Add Teams To User"
        addTeam(userId: ID!, teamId: ID!): User
        "Add Favorite Projects To User"
        addFavoriteProject(userId: ID!, projectId: ID!): User
        "Add Tasks To User"
        addFavoriteTask(userId: ID!, taskId: ID!): User
        "Edit a User"
        editUser(userId: ID!, input: EditUserInput!): User
        "Delete a User"
        deleteUser(userId: ID!): User
        "Remove Teams To User"
        removeTeam(userId: ID!, teamId: ID!): User
        "Remove Favorite Project To User"
        removeFavoriteProject(userId: ID!, projectId: ID!): User
        "Remove Favorite Task To User"
        removeFavoriteTask(userId: ID!, taskId: ID!): User
        "Revoke Refresh Tokens For User"
        revokeRFTokensForUser(userId: ID!): Boolean
    }
`;

module.exports = typeDefs;
