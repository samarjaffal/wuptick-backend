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
    /* let currentMonth = currentDate.getMonth() + 1; */
    let currentMonth = 8;
    let logs, sortedLogs, taskLogs, projectLogs, commentLogs;
    let lastDataObject = {
        ids: null,
        dateType: '$month',
        dateFilter: currentMonth,
        queryFilter: '_id',
        collection: null,
        limit: 3,
        query: null,
    };

    try {
        const teamId = ObjectID(_teamId);
        team = await mongoDB.get('teams', teamId);

        projectIds = team.projects;
        projects = await getProjects(projectIds, lastDataObject);
        projectIds = await mongoHelper.getIdsFromArray(projects);

        modules = await getModulesWithProjectIds(projectIds, lastDataObject);

        tasks = await getTasksFromModules(modules, lastDataObject, projects);

        let taskComments = await getTaskComments(tasks, lastDataObject);

        taskLogs = await generateLog(tasks, 'task');
        projectLogs = await generateLog(projects, 'project');
        commentLogs = await generateLog(taskComments, 'comment');

        logs = [...taskLogs, ...projectLogs, ...commentLogs];
        console.log('logs', logs);
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
    query,
}) => {
    let documents, _query;
    try {
        if (!query) {
            _query = {
                [queryFilter]: { $in: ids },
                $expr: { $eq: [{ [dateType]: '$created_at' }, dateFilter] },
            };
            documents = await mongoDB.getAll(collection, _query, false, limit);
        } else {
            _query = query;
            documents = await mongoDB.aggregate(collection, _query);
        }

        console.log('query', query);
    } catch (error) {
        console.error(error);
    }
    return documents || null;
};

const generateLog = async (documents, type) => {
    let log = {};
    let logs = [];
    let action = 'created';

    log.type = type;

    let created_at, updated_at;
    let description, user;

    for (const document of documents) {
        //get user info
        user = await getUserInfo(document.owner);
        if (user) {
            log.user = {
                userId: document.owner,
                name: `${user.name} ${user.last_name}`,
                avatar: user.avatar,
            };
        }

        //compare dates created_at and updated_at
        created_at = new Date(document.created_at);
        updated_at =
            'updated_at' in document ? new Date(document.updated_at) : null;

        //check if it's created, updated...
        if (updated_at == null) {
            action = type == 'comment' ? 'added' : 'created';
            description = `${action} a new ${type}`;
            log.dateFilter = created_at;
        } else if (updated_at > created_at) {
            action = 'updated';
            description = `${action} a ${type}`;
            log.dateFilter = updated_at;
        }

        log._id = ObjectID();
        log.action = action;
        log.created_at = created_at;
        log.updated_at = updated_at;

        log.body = {
            logId: document._id,
            name: document.name,
            description: description,
            info: 'description' in document ? document.description : '',
            project: {
                projectId: 'projectId' in document ? document.projectId : null,
                name: 'projectName' in document ? document.projectName : '',
                image: type == 'project' ? document.image : '',
            },
            comment: type == 'comment' ? document.comment : null,
        };
        logs = [...logs, { ...log }];
    }

    return logs;
};

const getTasksFromModules = async (modules, lastDataObject, projects) => {
    let tasks = [];
    for (const module of modules) {
        taskLists = module.task_lists;

        let project = projects.find((project) =>
            module.project.equals(project._id)
        );

        taskIds = taskLists
            .map((list) => list.tasks.map((task) => task))
            .flat();

        let tempTasks = await getLastDataFromCollection({
            ...lastDataObject,
            ids: taskIds,
            collection: 'tasks',
        });

        tempTasks = tempTasks.map((task) => ({
            ...task,
            projectId: project._id,
            projectName: project.name,
        }));

        tasks = [...tasks, ...tempTasks];
        tasks;
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

const getTaskComments = async (tasks, lastDataObject) => {
    let taskIds = await mongoHelper.getIdsFromArray(tasks);

    const query = [
        { $unwind: '$comments' },
        {
            $project: {
                month: { $month: '$comments.created_at' },
                task: '$task',
                comment: '$comments',
            },
        },
        {
            $match: {
                task: { $in: taskIds },
                month: lastDataObject.dateFilter,
            },
        },
    ];
    comments = await getLastDataFromCollection({
        ...lastDataObject,
        collection: 'comments',
        query: query,
    });
    console.log('comments', comments);

    let newComments = [];
    comments.forEach((com) => {
        let task = tasks.find((task) => com.task.equals(task._id));
        let temp = {
            _id: task._id,
            name: task.name,
            description: task.description,
            owner: com.comment.owner,
            created_at: com.comment.created_at,
            comment: {
                commentId: com.comment._id,
                comment: com.comment.comment,
            },
        };
        newComments = [...newComments, temp];
    });

    return newComments;
};

module.exports = {
    generateLastActivity,
};
