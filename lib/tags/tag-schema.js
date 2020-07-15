const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Tag {
        _id: ID!
        name: String!
        color: String
        team: Team!
        created_at: String!
    }

    input TagInput {
        name: String!
        color: String
        team: TagTeam!
        created_at: String!
    }

    input TagTeam {
        _id: ID!
    }

    extend type Mutation {
        "Create a Tag"
        createTag(input: TagInput!): Tag
    }
`;

module.exports = typeDefs;
