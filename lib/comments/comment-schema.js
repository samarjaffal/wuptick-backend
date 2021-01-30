const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Comment {
        _id: ID!
        task: Task
        topic: Topic
        page: Int!
        count: Int!
        comments: [CommentBucket]
        created_at: DateTime
    }

    type CommentBucket {
        _id: ID!
        owner: User!
        comment: String!
        commentJson: String
        created_at: DateTime!
        updated_at: DateTime
    }

    input CommentBucketInput {
        owner: Owner!
        comment: String!
        commentJson: String
        created_at: DateTime!
    }

    input EditCommentBucketInput {
        comment: String
    }

    input CommentInput {
        task: CommentTask
        topic: CommentTopic
        comments: CommentBucketInput!
    }

    input EditCommentInput {
        taskId: ID
        topicId: ID
        commentId: ID
        comment: String
        commentJson: String
        updated_at: DateTime!
    }

    input CommentTask {
        _id: ID!
    }

    input CommentTopic {
        _id: ID!
    }

    extend type Query {
        "Retrieve all commnts for a specific task"
        getCommentsForTask(taskId: ID!): [Comment]
        "Retrieve all commnts for a specific topic"
        getCommentsForTopic(topicId: ID!): [Comment]
    }

    extend type Mutation {
        "Create a Comment"
        createComment(input: CommentInput!): Comment
        "Edit a Comment"
        editComment(input: EditCommentInput!): Comment
        "Delete a Comment"
        deleteComment(commentId: ID!, taskId: ID, topicId: ID): Comment
    }
`;

module.exports = typeDefs;
