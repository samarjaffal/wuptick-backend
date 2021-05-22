'use strict';
const MongoLib = require('../lib/db/mongo');

const collection = 'settings';
const mongoDB = new MongoLib();

module.exports = {
    getSettings: async () => {
        let settings;
        try {
            const query = {};
            settings = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }

        return settings || [];
    },

    getSetting: async (key) => {
        let setting;
        try {
            const query = { key };
            setting = await mongoDB.findOne(collection, query);
        } catch (error) {
            console.error(error);
        }
        console.log(setting, 'setting');
        return setting || {};
    },
};
