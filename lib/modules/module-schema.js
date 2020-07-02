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
        id: ID!
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
    }
`;

module.exports = typeDefs;
