const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../helpers/mongo-helper');
const mongoDB = new MongoLib();
const { sortArrayByDate } = require('../helpers/data-structures');
const { getUserInfo } = require('../helpers/user-helper');

const generateLastActivity = async (_teamId) => {
    let team;
    let projects, projectIds;
    let modules, tasks, taskLists, taskIds;
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1;
    let logs, sortedLogs, taskLogs, projectLogs;
    let lastDataObject = {
        ids: null,
        dateType: '$month',
        dateFilter: currentMonth,
        queryFilter: '_id',
        collection: null,
        limit: 3,
    };

    try {
        const teamId = ObjectID(_teamId);
        team = await mongoDB.get('teams', teamId);

        projectIds = team.projects;
        projects = await getProjects(projectIds, lastDataObject);
        projectIds = await mongoHelper.getIdsFromArray(projects);

        modules = await getModulesWithProjectIds(projectIds, lastDataObject);

        tasks = await getTasksFromModules(modules, lastDataObject);

        taskLogs = await generateLog(teamId, tasks, 'task');
        projectLogs = await generateLog(teamId, projects, 'project');
        logs = [...taskLogs, ...projectLogs];

        sortedLogs = sortArrayByDate(logs, 'dateFilter');

        const query = { team: ObjectID(teamId) };
        const data = { $set: { logs: sortedLogs } };
        mongoDB.updateSet('activity', query, data);

        return sortedLogs || null;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const getLastDataFromCollection = async ({
    ids,
    dateType,
    dateFilter,
    queryFilter = _id,
    collection,
    limit,
}) => {
    let documents;
    try {
        const query = {
            [queryFilter]: { $in: ids },
            $expr: { $eq: [{ [dateType]: '$created_at' }, dateFilter] },
        };
        documents = await mongoDB.getAll(collection, query, false, limit);
    } catch (error) {
        console.error(error);
    }
    return documents || null;
};

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
        log.info = 'description' in document ? document.description : '';
        log.projectImg = type == 'project' ? document.image : '';
        log.name = document.name;
        log._id = document._id;
        logs = [...logs, { ...log }];
    }

    return logs;
};

const getTasksFromModules = async (modules, lastDataObject) => {
    let tasks = [];
    for (const module of modules) {
        taskLists = module.task_lists;

        taskIds = taskLists
            .map((list) => list.tasks.map((task) => task))
            .flat();

        let tempTasks = await getLastDataFromCollection({
            ...lastDataObject,
            ids: taskIds,
            collection: 'tasks',
        });
        tasks = [...tasks, ...tempTasks];
    }

    return tasks;
};

const getModulesWithProjectIds = async (projectIds, lastDataObject) => {
    modules = await getLastDataFromCollection({
        ...lastDataObject,
        ids: projectIds,
        queryFilter: 'project',
        collection: 'modules',
    });

    return modules;
};

const getProjects = async (projectIds, lastDataObject) => {
    return (projects = await getLastDataFromCollection({
        ...lastDataObject,
        ids: projectIds,
        collection: 'projects',
    }));
};

module.exports = {
    generateLastActivity,
};
