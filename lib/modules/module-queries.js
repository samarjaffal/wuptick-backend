'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const collection = 'modules';
const mongoDB = new MongoLib();
const Module = require('../../helpers/module-helper');
const { moduleLoader, projectLoader } = require('../db/dataLoaders');

module.exports = {
    getModules: async (_, { projectId }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return await Module.getModules(projectId);
    },

    getProjectModules: async (_, { projectId }, context) => {
        let modules, project, sortedModules;
        if (!context.isAuth) {
            return null;
        }
        try {
            project = await projectLoader.load(ObjectID(projectId));

            const modulesOrder = project.modules_order;

            const query = { project: ObjectID(projectId), deleted_at: { $exists: false } };
            modules = await mongoDB.getAll(collection, query);

            const tempModules = [...modules];

            let reference_object = {};

            if (typeof modulesOrder !== 'undefined') {
                for (var i = 0; i < modulesOrder.length; i++) {
                    reference_object[modulesOrder[i]] = i;
                }
            }

            sortedModules = tempModules.sort(function (a, b) {
                return (
                    reference_object[String(a._id)] -
                    reference_object[String(b._id)]
                );
            });
        } catch (error) {
            console.error(error);
        }

        return sortedModules || [];
    },

    getModule: async (_, { moduleId }, context) => {
        if (!context.isAuth) {
            return null;
        }

        return await Module.getModule(moduleId);
    },
};
