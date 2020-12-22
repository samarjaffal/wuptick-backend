'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');
const Module = require('../../helpers/module-helper');
const collection = 'modules';
const mongoDB = new MongoLib();

const defaults = {
    description: '',
    status: 'active',
    task_lists: [],
    modules_order: [],
};

module.exports = {
    createModule: async (root, { input }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return await Module.createModule(input);
    },

    editModule: async (root, { moduleId, input }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return await Module.editModule(moduleId, input);
    },

    deleteModule: async (root, { moduleId }, context) => {
        let module;
        if (!context.isAuth) {
            return null;
        }
        module = await crudHelper.delete(collection, moduleId, 'module');
        return module || moduleId;
    },

    addTaskList: async (root, { moduleId, listId, name }) => {
        let module;
        const operator = {
            format: {
                task_lists: { _id: ObjectID(listId), name, tasks: [] },
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
        return module;
    },

    removeTaskList: async (root, { moduleId, listId }) => {
        let module;
        const operator = { task_lists: { _id: ObjectID(listId) } };
        module = await crudHelper.removeSet(
            collection,
            moduleId,
            'module',
            operator
        );
        return module;
    },

    addTask: async (root, { moduleId, listId, taskId }) => {
        let module;
        try {
            module = await mongoDB.get(collection, moduleId);
            if (!module) throw new Error("The module doesn't exist");

            let query = {
                _id: ObjectID(moduleId),
                'task_lists._id': ObjectID(listId),
            };
            let data = { $push: { 'task_lists.$.tasks': ObjectID(taskId) } };
            await mongoDB.updateSet(collection, query, data);
        } catch (error) {
            console.error(error);
        }
        module = { ...module };
        return module;
    },

    removeTask: async (root, { moduleId, listId, taskId }) => {
        let module;
        let query = {
            _id: ObjectID(moduleId),
            'task_lists._id': ObjectID(listId),
        };
        let data = { $pull: { 'task_lists.$.tasks': ObjectID(taskId) } };
        await mongoDB.updateSet(collection, query, data);
        module = await mongoDB.get(collection, moduleId);
        return module;
    },

    saveModulesOrder: async (root, { moduleIds, projectId }, context) => {
        if (!context.isAuth) {
            return null;
        }
        let ids;
        try {
            ids = moduleIds.map((id) => ObjectID(id));
            const query = { _id: ObjectID(projectId) };
            const data = { $set: { modules_order: ids } };
            console.log('ids', ids);
            await mongoDB.updateSet('projects', query, data);
        } catch (error) {
            console.log(error);
            return false;
        }
        return ids;
    },

    saveTaskListsOrder: async (_, { moduleId, taskLists }, context) => {
        if (!context.isAuth) {
            return null;
        }

        return await Module.saveTaskListsOrder(moduleId, taskLists);
    },
};
