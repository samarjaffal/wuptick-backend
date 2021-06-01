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
        user_attempts: Int!
        status: Status
        avatar: String
        level: Level
        tk_version: Int
        teams: [Team]
        favorite_projects: [Project]
        favorite_tasks: [Task]
        confirmed: Boolean
        color: String
    }

    type UserProject {
        project: Project
        favorite: Boolean
    }

    type LastActivity {
        _id: ID!
        team: ID!
        month: Int!
        year: Int!
        logs: [Log]
    }

    type Log {
        _id: ID
        user: ActivityUser
        type: String
        dateFilter: DateTime
        created_at: DateTime
        updated_at: DateTime
        action: String
        body: ActivityBody
    }

    type ActivityUser {
        userId: ID!
        name: String
        firstName: String
        lastName: String
        avatar: String
        color: String
    }

    type ActivityBody {
        logId: ID
        name: String
        description: String
        info: String
        project: ActivityProject
        comment: ActivityComment
    }

    type ActivityProject {
        projectId: ID
        name: String
        image: String
        color: String
    }

    type ActivityComment {
        commentId: ID
        comment: String
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
        color: String
    }

    type Query {
        "User Logged in"
        me: User
        "Get Last Activity Feed For User"
        getLastActivity(teamId: ID!): [Log]
        "Retrieve all users"
        getUsers: [User]
        "Get User by Id"
        getUser(userId: ID!): User
        "Test Users"
        testUser: Boolean
    }

    type Mutation {
        "Add Teams To User"
        addTeam(userId: ID!, teamId: ID!): User
        "Add Favorite Projects To User"
        addFavoriteProject(userId: ID!, projectId: ID!): User
        "Toggle Favorite Task To User"
        toggleFavTask(state: Boolean!, taskId: ID!): ID
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
        "Update avatar for user"
        updateAvatar(imgStr: String!, fileName: String!): Boolean
    }
`;

module.exports = typeDefs;
