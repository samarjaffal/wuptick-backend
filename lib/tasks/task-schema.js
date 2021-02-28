const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Task {
        _id: ID!
        name: String!
        description: String
        descriptionJson: String
        owner: User!
        created_at: DateTime!
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
        descriptionJson: String
        deadline: String
        assigned: Assigned
        tag: TagInput
        estimated_time: String
        priority: Boolean
        url: String
        done: Boolean
    }

    input EditTaskInput {
        name: String
        description: String
        descriptionJson: String
        deadline: String
        assigned: Assigned
        tag: ID
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
        getTasks(moduleId: ID!): [Task]
        "Get a single task"
        getTask(taskId: ID!): Task
    }

    extend type Mutation {
        "Crate a Task"
        createTask(input: TaskInput!, moduleId: ID!, listId: ID!): ID
        "Edit a Task"
        editTask(taskId: ID!, input: EditTaskInput!, url: String): Task
        "Delete a Task"
        deleteTask(taskId: ID!, listId: ID!, moduleId: ID!): Boolean
        "Add Collaborator to Task"
        addCollaborator(taskId: ID!, userId: ID!): ID
        "Remove Collaborator from Task"
        removeCollaborator(taskId: ID!, userId: ID!): ID
        "Assign Task to User"
        assignTask(taskId: ID!, userId: ID): ID
        "Add  Deadline to Task"
        addDeadlineToTask(taskId: ID!, date: String): Boolean
    }
`;

module.exports = typeDefs;
