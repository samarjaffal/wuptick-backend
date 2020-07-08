const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Task {
        _id: ID!
        name: String!
        description: String
        owner: User!
        created_at: String!
        deadline: String
        assigned: User
        collaborators: [User]
        tag: Tag
        estimated_time: Int
        priority: Boolean
        url: String
        done: Boolean
    }

    input TaskInput {
        name: String!
        description: String
        owner: Owner!
        created_at: String!
        deadline: String
        assigned: Assigned
        tag: TagInput
        estimated_time: String
        priority: Boolean
        url: String
        done: Boolean
    }

    input Assigned {
        _id: ID!
    }

    extend type Query {
        "Retrieve all tasks"
        getTasks: [Task]
    }

    extend type Mutation {
        "Crate a Task"
        createTask(input: TaskInput!): Task
    }
`;

module.exports = typeDefs;
