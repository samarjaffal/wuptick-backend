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

    #   input EditTopicInput {
    #      name: String
    #        description: String
    #        tag: TagInput
    #        url: String
    #    }

    input LinkModule {
        _id: ID!
    }

    extend type Query {
        "Retrieve all links for a specific user and module"
        getLinks(userId: ID!, moduleId: ID!): [Link]
    }

    extend type Mutation {
        "Create a Link"
        createLink(input: LinkInput!): Link
    }
`;

module.exports = typeDefs;
