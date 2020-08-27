const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');

const mongoDB = new MongoLib();
const generateLog = async (teamId, documents, type) => {
    let log = {};
    let logs = [];
    let action = 'created';

    log.team = teamId;
    log.type = type;

    let created_at, updated_at;
    let description, user;

    for (const document of documents) {
        //get user info
        user = await getUserInfo(document.owner);
        if (user) {
            log.userId = document.owner;
            log.user = `${user.name} ${user.last_name}`;
            log.userAvatar = user.avatar;
        }

        //compare dates created_at and updated_at
        created_at = new Date(document.created_at);
        updated_at =
            'updated_at' in document ? new Date(document.updated_at) : null;

        //check if it's created, updated...
        if (updated_at == null) {
            action = 'created';
            description = `created a new ${type}`;
            log.dateFilter = created_at;
        } else if (updated_at > created_at) {
            action = 'updated';
            description = `updated a ${type}`;
            log.dateFilter = updated_at;
        }

        log.action = action;
        log.created_at = created_at;
        log.updated_at = updated_at;
        log.description = description;
        log.name = document.name;
        log._id = document._id;
        logs = [...logs, { ...log }];
    }

    return logs;
};

const getUserInfo = async (userId) => {
    try {
        let user = await mongoDB.get('users', userId);
        return user || null;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    generateLog,
};
