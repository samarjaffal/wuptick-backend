const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Invitation {
        _id: ID!
        email: String!
        created_at: DateTime!
        status: String!
        projectId: ID
        teamId: ID
        updated_at: DateTime
    }

    extend type Query {
        "Retrieve all user invitations for a specific project"
        getInvitationsForProject(projectId: ID!): [Invitation]
    }

    extend type Mutation {
        "Remove an invitation"
        removeInvitation(invitationId: ID!): Invitation
    }
`;

module.exports = typeDefs;
