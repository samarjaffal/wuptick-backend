const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Team {
        _id: ID!
        name: String!
        owner: User
        projects: [Project]
        members: [User]
    }

    input TeamInput {
        name: String!
        owner: Owner
    }

    input EditTeamInput {
        name: String
    }

    input Owner {
        _id: ID!
    }

    # input TeamProjects {
    #     _id: ID!
    # }

    extend type Query {
        "Retrieve all teams for a user"
        getTeams: [Team]
    }

    extend type Mutation {
        "Crate a Team"
        createTeam(input: TeamInput!): Team
        "Add Project to a Team"
        addProject(teamId: ID!, projectId: ID!): Team
        "Edit a Team"
        editTeam(teamId: ID!, input: EditTeamInput!): Team
        "Delete a Team"
        deleteTeam(teamId: ID!): Boolean
        "Remove Project from Team"
        removeProject(teamId: ID!, projectId: ID!): Team
        "Remove Member from Team"
        removeMemberFromTeam(teamId: ID!, userId: ID!): Boolean
    }
`;

module.exports = typeDefs;
