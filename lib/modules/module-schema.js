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
    }

    input EditModuleInput {
        name: String
        description: String
        status: Status
    }

    input TaskListsInput {
        _id: ID!
        name: String
        tasks: [ID]
    }

    input ModuleProject {
        _id: ID!
    }

    extend type Query {
        "Retrieve all modules"
        getModules: [Module]
        "Retrieve a single module"
        getModule(moduleId: ID!): Module
        "Get Project Modules"
        getProjectModules(projectId: ID!): [Module]
    }

    extend type Mutation {
        "Create a Module"
        createModule(input: ModuleInput!): Module
        "Edit a Module"
        editModule(moduleId: ID!, input: EditModuleInput!): Module
        "Delete a Module"
        deleteModule(moduleId: ID!): ID
        "Add a Task List to a Module"
        addTaskList(moduleId: ID!, name: String!): TaskLists
        "Edit a Task List from Module"
        editTaskList(moduleId: ID!, listId: ID!, name: String!): ID
        "Remove a Task List from Module"
        removeTaskList(moduleId: ID!, listId: ID!): ID
        "Add Task To List"
        addTask(moduleId: ID!, listId: ID!, taskId: ID!): Boolean
        "Remove a Task From List"
        removeTask(moduleId: ID!, listId: ID!, taskId: ID!): Module
        "Save modules order for a project"
        saveModulesOrder(moduleIds: [String]!, projectId: ID!): [ID]
        saveTaskListsOrder(moduleId: ID!, taskLists: [TaskListsInput]): Boolean
    }
`;

module.exports = typeDefs;
