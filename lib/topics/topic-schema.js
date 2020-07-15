const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Topic {
        _id: ID!
        name: String!
        description: String
        owner: User!
        module: Module!
        created_at: String!
        collaborators: [User]
        tag: Tag
        url: String
    }

    input TopicInput {
        name: String!
        description: String
        owner: Owner!
        module: TopicModule!
        created_at: String!
        tag: TagInput
        url: String
    }

    input EditTopicInput {
        name: String
        description: String
        tag: TagInput
        url: String
    }

    input TopicModule {
        _id: ID!
    }

    extend type Query {
        "Retrieve all topics"
        getTopics: [Topic]
    }

    extend type Mutation {
        "Create a Topic"
        createTopic(input: TopicInput!): Topic
        "Edit a Topic"
        editTopic(topicId: ID!, input: EditTopicInput!): Topic
        "Delete a Topic"
        deleteTopic(topicId: ID!): Topic
        "Add Collaborator to Topic"
        addCollaboratorOnTopic(topicId: ID!, userId: ID!): Topic
        "Remove Collaborator from Task"
        removeCollaboratorFromTopic(topicId: ID!, userId: ID!): Topic
    }
`;

module.exports = typeDefs;