'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const collection = 'modules';
const mongoDB = new MongoLib();
const { moduleLoader, projectLoader } = require('../db/dataLoaders');

module.exports = {
    getModules: async () => {
        let modules;
        try {
            const query = {};
            modules = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }

        return modules || [];
    },

    getProjectModules: async (_, { projectId }, context) => {
        let modules, project, sortedModules;
        if (!context.isAuth) {
            return null;
        }
        try {
            project = await projectLoader.load(ObjectID(projectId));

            const modulesOrder = project.modules_order;

            const query = { project: ObjectID(projectId) };
            modules = await mongoDB.getAll(collection, query);

            const tempModules = [...modules];

            let reference_object = {};
            for (var i = 0; i < modulesOrder.length; i++) {
                reference_object[modulesOrder[i]] = i;
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
};
