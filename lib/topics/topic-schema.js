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

    input TopicModule {
        _id: ID!
    }

    extend type Query {
        "Retrieve all topics"
        getTopics: [Topic]
    }

    extend type Mutation {
        "Crate a Topic"
        createTopic(input: TopicInput!): Topic
        #"Edit a Task"
        #editTask(taskId: ID!, input: EditTaskInput!): Task
        #"Delete a Task"
        #deleteTask(taskId: ID!): Task
        #"Add Collaborator to Task"
        #addCollaborator(taskId: ID!, userId: ID!): Task
        #"Remove Collaborator from Task"
        #removeCollaborator(taskId: ID!, userId: ID!): Task
    }
`;

module.exports = typeDefs;
