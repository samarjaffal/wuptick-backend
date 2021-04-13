const Email = require('../helpers/email-helper');
const { config } = require('../config/index');
const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const mongoDB = new MongoLib();
const Notification = require('../helpers/notification');
const {
    newCommentMention,
} = require('../templates/email-templates/new-comment-mention');

const emailTemplates = {
    mentionTaskEmail: {
        from: `"Wuptick Team" <dev.wuptick@gmail.com>`,
        to: 'dev.wuptick@gmail.com',
        subject: 'You have been mentioned on a comment',
        html: '~Hello World~',
    },

    newCommentTaskEmail: {
        from: `"Wuptick Team" <dev.wuptick@gmail.com>`,
        to: 'dev.wuptick@gmail.com',
        subject: 'There is a new comment',
        html: '~Hello World~',
    },
};

module.exports = {
    setupMentionsEmail: async (mentionIds, taskId, comment, url) => {
        if (mentionIds.length == 0) return;

        let users, task;
        mentionIds = mentionIds.map((id) => ObjectID(id));

        users = await mongoDB.getAll('users', { _id: { $in: mentionIds } });

        task = await mongoDB.get('tasks', taskId);

        if (users.length == 0) return;

        users.forEach((user) => {
            module.exports.sendMentionEmail({
                email: user.email,
                task,
                user,
                comment,
                url,
            });
        });
    },

    setupNewCommentEmail: async (mentionIds, taskId, comment, url = '/') => {
        let users, task, collabIds;

        task = await mongoDB.get('tasks', taskId);

        console.log(mentionIds, 'mentionIds');

        if (mentionIds.length > 0) {
            collabIds = task.collaborators.filter(
                (collab) => !mentionIds.includes(String(collab))
            );
        } else {
            collabIds = task.collaborators;
        }

        collabIds = collabIds.filter(
            (collab) => String(comment.owner) !== String(collab)
        );

        console.log(collabIds, 'colabIds');

        //create notifications for collaborators
        await Notification.createManyNotifications(
            taskId,
            collabIds,
            'task_comment',
            url
        );

        users = await mongoDB.getAll('users', { _id: { $in: collabIds } });
        if (users.length == 0) return;

        users.forEach((user) => {
            module.exports.sendNewCommentEmail({
                email: user.email,
                task,
                user,
                comment,
                url,
            });
        });
    },

    sendNewCommentEmail: (data) => {
        let newUrl;
        newUrl = `${config.frontURL}/${data.url}`;
        data.url = newUrl;
        emailTemplates.newCommentTaskEmail.to = data.email;
        emailTemplates.newCommentTaskEmail.subject = `New reply on: ${data.task.name}`;
        emailTemplates.newCommentTaskEmail.html = newCommentMention(data);
        Email.sendEmail(emailTemplates.newCommentTaskEmail);
    },

    sendMentionEmail: (data) => {
        let newUrl;
        newUrl = `${config.frontURL}/${data.url}`;
        data.url = newUrl;
        emailTemplates.mentionTaskEmail.to = data.email;
        emailTemplates.mentionTaskEmail.subject = `New mention on: ${data.task.name}`;
        emailTemplates.mentionTaskEmail.html = newCommentMention(data);
        Email.sendEmail(emailTemplates.mentionTaskEmail);
    },
};
