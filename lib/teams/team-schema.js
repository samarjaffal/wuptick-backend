const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Team {
        _id: ID!
        name: String!
        owner: User
        projects: [Project]
    }

    input TeamInput {
        name: String!
        owner: Owner
        projects: [TeamProjects]
    }

    input Owner {
        _id: ID!
    }

    input TeamProjects {
        _id: ID!
    }

    extend type Query {
        "Retrieve all teams"
        getTeams: [Team]
    }

    extend type Mutation {
        "Crate a Team"
        createTeam(input: TeamInput!): Team
    }
`;

module.exports = typeDefs;
