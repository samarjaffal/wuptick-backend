const Email = require('../helpers/email-helper');
const { config } = require('../config/index');
const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const mongoDB = new MongoLib();
const { assignTask } = require('../templates/email-templates/assign-task');
const {
    newTaskMention,
} = require('../templates/email-templates/new-task-mention');

const emailTemplates = {
    mentionTaskEmail: {
        from: `"Wuptick Team" <dev.wuptick@gmail.com>`,
        to: 'dev.wuptick@gmail.com',
        subject: 'You have been mentioned on a task',
        html: '~Hello World~',
    },
    assignTaskEmail: {
        from: `"Wuptick Team" <dev.wuptick@gmail.com>`,
        to: 'dev.wuptick@gmail.com',
        subject: 'You have been assigned a new Task',
        html: '~Hello World~',
    },
};

module.exports = {
    setupMentionsEmail: async (mentionIds, taskId, url) => {
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
                url,
            });
        });
    },
    sendMentionEmail: (data) => {
        let newUrl;
        newUrl = `${config.frontURL}/${data.url}`;
        data.url = newUrl;
        emailTemplates.mentionTaskEmail.to = data.email;
        emailTemplates.mentionTaskEmail.subject = `Mention on: ${data.task.name}`;
        emailTemplates.mentionTaskEmail.html = newTaskMention(data);
        Email.sendEmail(emailTemplates.mentionTaskEmail);
    },

    sendAssignTaskEmail: (data) => {
        let newUrl;
        newUrl = `${config.frontURL}/${data.url}`;
        data.url = newUrl;
        emailTemplates.assignTaskEmail.to = data.email;
        emailTemplates.assignTaskEmail.subject = `${data.task.name} - has been assigned to you.`;
        emailTemplates.assignTaskEmail.html = assignTask(data);
        Email.sendEmail(emailTemplates.assignTaskEmail);
    },
};
