const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type File {
        _id: ID!
        name: String!
        description: String
        parentId: ID!
        owner: User!
        created_at: DateTime!
        parentUrl: String!
        fileUrl: String!
    }

    input FileInput {
        name: String!
        description: String
        parentId: ID!
        owner: Owner!
        created_at: String!
        parentUrl: String!
        fileUrl: String!
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
        "Retrieve all files for subject: module,task, etc..."
        getFiles(id: ID!): [File]
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
