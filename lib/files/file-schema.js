const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type File {
        _id: ID!
        name: String!
        description: String
        module: Module!
        task: Task
        owner: User!
        created_at: String!
    }

    input FileInput {
        name: String!
        description: String
        module: FileModule!
        task: FileTask
        owner: Owner!
        created_at: String!
    }

    input EditFileInput {
        name: String
        description: String
    }

    input FileModule {
        _id: ID!
    }

    input FileTask {
        _id: ID!
    }

    extend type Query {
        "Retrieve all files for a specific module"
        getFiles(moduleId: ID!): [File]
        "Retrieve all files for a specific task"
        getFilesForTask(moduleId: ID!, taskId: ID!): [File]
    }

    extend type Mutation {
        "Create a File"
        createFile(input: FileInput!): File
        "Edit a File"
        editFile(fileId: ID!, input: EditFileInput!): File
        "Delete a File"
        deleteFile(fileId: ID!): File
    }
`;

module.exports = typeDefs;
