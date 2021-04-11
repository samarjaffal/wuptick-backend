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
    }

    extend type Query {
        "Retrieve all notifications for a user"
        getNotifications: [Notification]
    }

    extend type Mutation {
        "Crate a Notification"
        createNotification(input: NotificationInput!): ID
        "Set notification as read"
        setNotificationAsRead(ids: [ID]): Boolean
    }
`;

module.exports = typeDefs;
