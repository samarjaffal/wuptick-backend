const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Comment {
        _id: ID!
        task: Task
        topic: Topic
        page: Int!
        count: Int!
        comments: [CommentBucket]
    }

    type CommentBucket {
        _id: ID!
        owner: User!
        comment: String!
        created_at: String!
    }

    input CommentBucketInput {
        owner: Owner!
        comment: String!
        created_at: String!
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
        comment: String
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
        editComment(
            taskId: ID
            topicId: ID
            commentId: ID!
            input: EditCommentInput!
        ): Comment
    }
`;

module.exports = typeDefs;
