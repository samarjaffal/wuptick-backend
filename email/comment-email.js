const Email = require('../helpers/email-helper');
const { config } = require('../config/index');
const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const mongoDB = new MongoLib();
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
    sendMentionEmail: (data) => {
        let newUrl;
        newUrl = `${config.frontURL}/${data.url}`;
        data.url = newUrl;
        emailTemplates.mentionTaskEmail.to = data.email;
        emailTemplates.mentionTaskEmail.subject = `New reply on: ${data.task.name}`;
        emailTemplates.mentionTaskEmail.html = newCommentMention(data);
        Email.sendEmail(emailTemplates.mentionTaskEmail);
    },
};
