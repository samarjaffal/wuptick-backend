const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../helpers/mongo-helper');
const mongoDB = new MongoLib();
const { sortArrayByDate } = require('../helpers/data-structures');
const { getUserInfo } = require('../helpers/user-helper');

let team, projects, modules, tasks;
let currentDate = new Date();
let currentMonth = currentDate.getMonth() + 1;
/* let currentMonth = 8; */
let currentYear = currentDate.getFullYear();
let lastDataObject = {
    ids: null,
    dateType: '$month',
    dateFilter: currentMonth,
    queryFilter: '_id',
    collection: null,
    limit: 3,
    query: null,
};
const LIMIT_REGISTERS = 20;

const generateLastActivity = async (_teamId) => {
    let projectIds;
    let taskLists, taskIds;

    let logs, sortedLogs, taskLogs, projectLogs, commentLogs;

    try {
        const teamId = ObjectID(_teamId);

        //get team
        team = await mongoDB.get('teams', teamId);

        //get projects from team
        projectIds = team.projects;
        projects = await getProjects(projectIds);

        modules = await getModulesWithProjectIds(projectIds);
        /* console.log(modules, 'modules'); */

        tasks = await getTasksFromModules();
        /* console.log(tasks, 'tasks'); */

        let taskComments = await getTaskComments();
        /* console.log(taskComments, 'taskComments'); */

        taskLogs = await generateLog(tasks, 'task');
        /* console.log(taskLogs, 'taskLogs'); */
        projectLogs = await generateLog(projects, 'project');
        /* console.log(projectLogs, 'projectLogs'); */
        commentLogs = await generateLog(taskComments, 'comment');
        /* console.log(commentLogs, 'commentLogs'); */

        logs = [...taskLogs, ...projectLogs, ...commentLogs];
        sortedLogs = sortArrayByDate(logs, 'dateFilter');

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

        /* console.log('query', query); */
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
                firstName: `${user.name}`,
                lastName: `${user.last_name}`,
                avatar: user.avatar,
                color: user.color,
            };
        }

        //compare dates created_at and updated_at
        created_at = new Date(document.created_at.toString());
        updated_at =
            'updated_at' in document && document.updated_at !== null
                ? new Date(document.updated_at.toString())
                : null;

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
                projectId:
                    'projectId' in document ? document.projectId : document._id,
                name: 'projectName' in document ? document.projectName : '',
                image: type == 'project' ? document.image : '',
                color: 'color' in document ? document.color : '',
            },
            comment: type == 'comment' ? document.comment : null,
        };
        logs = [...logs, { ...log }];
    }

    return logs;
};

const getTasksFromModules = async () => {
    moduleIds = await mongoHelper.getIdsFromArray(modules);
    /* console.log(moduleIds, 'moduleIds'); */
    const query = {
        module: { $in: moduleIds },
    };
    const sort = { updated_at: -1, created_at: -1 };
    let tasks = await mongoDB.getAll(
        'tasks',
        query,
        false,
        LIMIT_REGISTERS,
        sort
    );

    let newTasks = tasks.map((task) => {
        let project = getProjectByModule(task.module);
        return {
            ...task,
            projectId: project._id,
            projectName: project.name,
            color: project.color,
        };
    });
    return newTasks;
};

const getModulesWithProjectIds = async (projectIds) => {
    const query = {
        project: { $in: projectIds },
    };
    const sort = { updated_at: -1, created_at: -1 };
    let modules = await mongoDB.getAll(
        'modules',
        query,
        false,
        LIMIT_REGISTERS,
        sort
    );
    return modules || [];
};

const getProjects = async (projectIds) => {
    const query = {
        _id: { $in: projectIds },
    };
    const sort = { updated_at: -1, created_at: -1 };
    let projects = await mongoDB.getAll(
        'projects',
        query,
        false,
        LIMIT_REGISTERS,
        sort
    );
    return projects || [];
};

const getTaskComments = async () => {
    moduleIds = await mongoHelper.getIdsFromArray(modules);
    const query = {
        module: { $in: moduleIds },
    };
    let tasks = await mongoDB.getAll('tasks', query);
    let taskIds = await mongoHelper.getIdsFromArray(tasks);

    const queryAggregate = [
        { $unwind: '$comments' },
        {
            $project: {
                task: '$task',
                comment: '$comments',
            },
        },
        {
            $match: {
                task: { $in: taskIds },
            },
        },
        { $sort: { 'comments.updated_at': -1, 'comments.created_at': -1 } },
        { $limit: LIMIT_REGISTERS },
    ];

    let documents = await mongoDB.aggregate('comments', queryAggregate);

    /* console.log(documents, 'documents'); */

    let comments = [];

    documents.forEach((document) => {
        let task = tasks.find((task) => document.task.equals(task._id));
        let project = getProjectByModule(task.module);
        let temp = {
            _id: task._id,
            name: task.name,
            description: task.description,
            owner: document.comment.owner,
            created_at: document.comment.created_at,
            projectId: project._id,
            projectName: project.name,
            color: project.color,
            comment: {
                commentId: document.comment._id,
                comment: document.comment.comment,
            },
        };
        comments = [...comments, temp];
    });

    return comments;
};

const getProjectByModule = (moduleId) => {
    let module;
    module = modules.find((module) => module._id.equals(moduleId));

    let project = projects.find((project) =>
        module.project.equals(project._id)
    );
    /* console.log('getProjectByModule', project); */
    return project || null;
};

const getProjectByTask = (taskId) => {
    /* console.log(projects, taskId, 'getProjectByTask'); */
    let project = projects.find((project) => {
        return modules.find((module) =>
            module.task_lists.some((list) =>
                list.tasks.some((task) => task.equals(taskId))
            )
        );
    });
    return project || null;
};

module.exports = {
    generateLastActivity,
};
