const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type AuthData {
        _id: ID!
        token: String!
        tokenExpiration: Int!
        userAttempts: Int!
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

    type AuthUserNotConfirmedError implements Error {
        message: String!
    }

    type ChangePassword {
        _id: ID
        password: Boolean
    }

    type OldPasswordError implements Error {
        message: String!
    }

    type InvalidUser implements Error {
        message: String!
    }


    input UserInput {
        email: String!
        password: String!
        token: String
    }

    type Member {
        user: ID!
        role: ID!
        team: ID!
    }

    union AuthRegisterResult = User | AuthUserError | AuthUserExistError
    union AuthLoginResult = AuthData | AuthUserError | AuthUserNotConfirmedError
    union ChangePasswordResult =
          ChangePassword
        | OldPasswordError
        | AuthUserError

    union newInvitationResult = Member | Invitation | InvalidUser

    extend type Query {
        "Login a User"
        login(email: String!, password: String!): AuthLoginResult!
    }

    extend type Mutation {
        "Create a User"
        register(input: UserInput!): AuthRegisterResult!
        "Logout a User"
        logout: Boolean
        "Change password"
        changePassword(
            oldPassword: String!
            newPassword: String!
        ): ChangePasswordResult!
        "Create a User by Invitation"
        registerUserByInvitation(
            email: String!
            projectId: ID!
            teamId: ID!
        ): newInvitationResult

        "Inactivate account for a logged user"
        inactivateAccountByLoggedUser: Boolean
    }
`;

module.exports = typeDefs;
