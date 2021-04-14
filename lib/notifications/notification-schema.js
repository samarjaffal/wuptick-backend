const { gql } = require('apollo-server-express');

const typeDefs = gql`
    enum NotificationType {
        task_comment
        task_assignation
        task_mention
    }

    type Notification {
        _id: ID!
        type: NotificationType!
        external_id: Task
        recipient: User!
        url: String
        created_at: DateTime!
        read_at: DateTime
    }

    input NotificationRecipient {
        _id: ID!
        name: String!
        last_name: String!
        email: String!
    }

    input NotificationInput {
        type: NotificationType!
        external_id: ID!
        recipient: ID!
        url: String
    }

    extend type Query {
        "Retrieve all notifications for a user"
        getNotifications: [Notification]
        "Set notification as read by user Id"
        setNotificationAsReadByUserId(externalId: ID!, recipient: ID!): Boolean
    }

    extend type Mutation {
        "Crate a Notification"
        createNotification(input: NotificationInput!): ID
        "Set notification as read"
        setNotificationAsRead(ids: [ID]): Boolean
    }
`;

module.exports = typeDefs;
