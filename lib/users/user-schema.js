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
        birthday: String!
        status: Status
        avatar: String
        level: Level
        teams: [Team]
        projects: [UserProject]
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

    input UserInput {
        name: String!
        last_name: String
        email: String!
        password: String!
        occupation: String
        birthday: String!
        status: Status
        avatar: String
        level: Level
        teams: [UserTeamInput]
        projects: [UserProjectInput]
        favorite_tasks: [UsetTaskInput]
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
    }

    input UserTeamInput {
        _id: ID!
    }

    input UserProjectInput {
        project: ID!
        favorite: Boolean
    }

    input UsetTaskInput {
        _id: ID!
    }

    type Mutation {
        "Crate a User"
        createUser(input: UserInput!): User
        "Add Teams To User"
        addTeam(userId: ID!, teamId: ID!): User
        "Add Projects To User"
        addProject(userId: ID!, projectId: ID!, roleId: ID, teamId: ID!): User
        "Add Tasks To User"
        addTask(userId: ID!, taskId: ID!): User
        "Edit a User"
        editUser(userId: ID!, input: EditUserInput!): User
        "Update a Favorite Project for a User"
        updateFavoriteProject(userId: ID!, input: UserProjectInput!): User
    }
`;

module.exports = typeDefs;
