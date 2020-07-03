const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Module {
        _id: ID!
        name: String!
        description: String
        project: Project!
        status: Status
        created_at: String!
        task_lists: [TaskLists]
    }

    type TaskLists {
        _id: ID!
        name: String
        tasks: [Task]
    }

    input ModuleInput {
        name: String!
        description: String
        project: ModuleProject!
        status: Status
        created_at: String!
    }

    input EditModuleInput {
        name: String
        description: String
        project: ModuleProject
        status: Status
    }

    input ModuleProject {
        _id: ID!
    }

    extend type Query {
        "Retrieve all modules"
        getModules: [Module]
    }

    extend type Mutation {
        "Crate a Module"
        createModule(input: ModuleInput!): Module
        "Edit a Module"
        editModule(moduleId: ID!, input: EditModuleInput!): Module
        "Delete a Module"
        deleteModule(moduleId: ID!): Module
    }
`;

module.exports = typeDefs;