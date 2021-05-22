'use strict';
const Setting = require('../../helpers/setting');

module.exports = {
    getSettings: (_, {}, context) => {
        if (!context.isAuth) {
            return null;
        }
        return Setting.getSettings();
    },

    getSetting: (_, { key }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return Setting.getSetting(key);
    },
};
