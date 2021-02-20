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
        team: ID!
        created_at: String
    }

    input EditTagInput {
        name: String
        color: String
    }

    input TagTeam {
        _id: ID!
    }

    extend type Query {
        "Retrieve all tags"
        getTags(teamId: ID!): [Tag]
    }

    extend type Mutation {
        "Create a Tag"
        createTag(input: TagInput!): Tag
        "Edit a Tag"
        editTag(tagId: ID!, input: EditTagInput!): Tag
        "Delete a Tag"
        deleteTag(tagId: ID!): Tag
    }
`;

module.exports = typeDefs;
