const MongoLib = require('../lib/db/mongo');
const mongoDB = new MongoLib();
const Module = require('./module-helper');
const Notification = require('./notification');
const crudHelper = require('./crud-helper');
const mongoHelper = require('./mongo-helper');
const { ObjectID } = require('mongodb');
const {
    setupMentionsEmail,
    sendAssignTaskEmail,
} = require('../email/task-email');
const { findMentions } = require('../shared/mentions');
const collection = 'tasks';

const defaults = {
    description: '',
    descriptionJson: '',
    deadline: '',
    assigned: null,
    tag: null,
    estimated_time: '',
    priority: false,
    url: '',
    done: false,
    collaborators: [],
};

module.exports = {
    createTask: async (input, moduleId, listId, userId) => {
        let task;
        input.owner = ObjectID(userId);
        input.collaborators = [ObjectID(userId)];
        /* if ('assigned' in input) input.assigned = ObjectID(input.assigned._id);
        if ('tag' in input) input.tag = ObjectID(input.tag._id); */
        input.created_at = new Date();
        task = await crudHelper.create(collection, input, defaults);
        await Module.addTask(moduleId, listId, String(task._id));
        return task._id;
    },

    editTask: async (taskId, input, url) => {
        let task;
        try {
            let inputData = { ...input };
            if ('tag' in inputData && inputData.tag !== null)
                inputData.tag = ObjectID(inputData.tag);
            if ('assigned' in inputData)
                inputData.assigned = ObjectID(input.assigned._id);
            task = await crudHelper.edit(collection, taskId, inputData, 'task');

            //get user ids from mentions on a task description
            let mentionIds = findMentions(inputData.description);

            //add someone to a task as a collaborator if it was mentioned
            await module.exports.addCollaborators(taskId, mentionIds);

            //send an email if someone has been mentioned on a task
            setupMentionsEmail(mentionIds, taskId, url);
        } catch (error) {
            console.error(error);
        }
        return task;
    },

    getTasks: async (moduleId) => {
        let tasks;
        try {
            const query = { module: ObjectID(moduleId) };
            tasks = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }

        return tasks || [];
    },

    getTask: async (taskId) => {
        let task;
        try {
            task = await mongoDB.get(collection, taskId);
        } catch (error) {
            console.error(error);
        }

        return task || {};
    },

    assignTask: async (taskId, userId, url) => {
        const assigned = userId !== null ? ObjectID(userId) : null;

        try {
            //update the assignation
            await mongoDB.update(collection, taskId, {
                assigned: assigned,
            });

            //add this user as a colaborator
            await module.exports.addCollaborator(taskId, userId);

            let task = await mongoDB.get(collection, taskId);
            let user = await mongoDB.get('users', userId);


            //add notification for this user
            const notification = {type: 'task_assignation', external_id: taskId, recipient: userId};
            await Notification.createNotification(notification);

            //send email that user has been assigned a new task
            if (assigned || assigned !== null) {
                sendAssignTaskEmail({ url: url, task, email: user.email });
            }

            //return userId
            return userId;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },

    addDeadlineToTask: async (taskId, date) => {
        let newDate = date !== null ? new Date(date).toISOString() : null;
        try {
            await mongoDB.update(collection, taskId, {
                deadline: newDate,
            });
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }

        return true;
    },

    deleteTask: async (taskId, listId, moduleId) => {
        await Module.removeTaskFromList(moduleId, listId, taskId);
        await crudHelper.delete(collection, taskId, 'task');
        return true;
    },

    addCollaborators: async (taskId, userIds) => {
        if (userIds.length == 0) return;
        userIds.forEach(async (userId) => {
            await module.exports.addCollaborator(taskId, userId);
        });
    },

    addCollaborator: async (taskId, userId) => {
        let updatedId;
        updatedId = await mongoHelper.addUniqueElementToArray(
            collection,
            ObjectID(taskId),
            'collaborators',
            ObjectID(userId)
        );
        return updatedId;
    },

    removeCollaborator: async (taskId, userId) => {
        let task;
        const operator = { collaborators: ObjectID(userId) };
        await crudHelper.removeSet(collection, taskId, 'task', operator);
        return userId;
    },
};
