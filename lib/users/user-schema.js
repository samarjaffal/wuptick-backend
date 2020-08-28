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
        name: String
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

    type LasActivity {
        team: ID!
        user: String
        userId: ID!
        userAvatar: String
        type: String
        dateFilter: DateTime
        action: String
        created_at: DateTime
        updated_at: DateTime
        description: String
        name: String
        _id: ID
    }

    type Query {
        "User Logged in"
        me: User
        "Get Last Activity Feed For User"
        getLastActivity: [LasActivity]
        "Retrieve all users"
        getUsers: [User]
        "Test Users"
        testUser: Boolean
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
