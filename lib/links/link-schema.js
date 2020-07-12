const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Link {
        _id: ID!
        name: String!
        description: String
        owner: User!
        module: Module!
        created_at: String!
    }

    input LinkInput {
        name: String!
        description: String
        owner: Owner!
        module: LinkModule!
        created_at: String!
    }

    input EditLinkInput {
        name: String
        description: String
    }

    input LinkModule {
        _id: ID!
    }

    extend type Query {
        "Retrieve all links for a specific module"
        getLinks(moduleId: ID!): [Link]
    }

    extend type Mutation {
        "Create a Link"
        createLink(input: LinkInput!): Link
        "Edit a Link"
        editLink(linkId: ID!, input: EditLinkInput!): Link
        "Delete a Link"
        deleteLink(linkId: ID!): Link
    }
`;

module.exports = typeDefs;
