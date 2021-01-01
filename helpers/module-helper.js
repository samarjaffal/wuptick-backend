const MongoLib = require('../lib/db/mongo');
const mongoDB = new MongoLib();
const mongoHelper = require('./mongo-helper');
const crudHelper = require('./crud-helper');
const { ObjectID } = require('mongodb');

const collection = 'modules';

const defaults = {
    description: '',
    status: 'active',
    task_lists: [],
    modules_order: [],
};

module.exports = {
    createModule: async (input) => {
        input.project = ObjectID(input.project._id);
        let module = await crudHelper.create(collection, input, defaults);
        return module;
    },

    editModule: async (moduleId, input) => {
        let module;
        module = await crudHelper.edit(collection, moduleId, input, 'module');
        return module;
    },

    getModule: async (moduleId) => {
        let module;
        try {
            module = await mongoDB.get(collection, moduleId);
        } catch (error) {
            console.error(error);
        }
        return module || {};
    },

    saveTaskListsOrder: async (moduleId, taskLists) => {
        try {
            let formatedLists = taskLists.map((list) => {
                let newTasks = list.tasks.map((task) => ObjectID(task));
                let newList = {
                    ...list,
                    _id: ObjectID(list._id),
                    tasks: [...newTasks],
                };
                return newList;
            });

            let data = { task_lists: formatedLists };

            await mongoDB.update(collection, moduleId, data);
        } catch (error) {
            console.error(error);
            return false;
        }
        return true;
    },

    addTaskList: async (moduleId, name) => {
        let module;
        const operator = {
            format: {
                task_lists: { _id: ObjectID(), name, tasks: [] },
            },
            key: 'task_lists',
            set: 'task_lists',
        };
        module = await crudHelper.addSet(
            collection,
            moduleId,
            operator,
            'module'
        );
        return module.task_lists[0];
    },

    addTask: async (moduleId, listId, taskId) => {
        try {
            let query = {
                _id: ObjectID(moduleId),
                'task_lists._id': ObjectID(listId),
            };
            let data = { $push: { 'task_lists.$.tasks': ObjectID(taskId) } };
            await mongoDB.updateSet(collection, query, data);
        } catch (error) {
            console.error(error);
        }
        return true;
    },

    removeTaskFromList: async (moduleId, listId, taskId) => {
        try {
            let query = {
                _id: ObjectID(moduleId),
                'task_lists._id': ObjectID(listId),
            };
            let data = { $pull: { 'task_lists.$.tasks': ObjectID(taskId) } };
            await mongoDB.updateSet(collection, query, data);
        } catch (error) {
            console.error(error);
        }
        return true;
    },

    removeTaskList: async (moduleId, listId) => {
        let module;

        try {
            module = await mongoDB.get(collection, moduleId);
            const list = module.task_lists.find((list) => list._id == listId);
            const taskIds = [...list.tasks];

            if (taskIds.length > 0) {
                let query = { _id: { $in: taskIds } };
                await mongoDB.deleteMany('tasks', query);
            }

            const operator = { task_lists: { _id: ObjectID(listId) } };
            await crudHelper.removeSet(
                collection,
                moduleId,
                'module',
                operator
            );
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }

        return module._id;
    },
};
