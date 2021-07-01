const { ObjectID } = require('mongodb');
const { config } = require('../../config/index');
const MongoLib = require('../../lib/db/mongo');
const Module = require('../../Models/module');

const dbTesting = config.dbTestName;
const mongoDB = new MongoLib(dbTesting);
const collection = 'modules_test';

const PROJECT_ID = ObjectID('5ef15e4d7eb6cec8dd4329b4');
const MODULE_ID = ObjectID('60cf5d1a574828d896fade3d');

const defaults = {
    description: '',
    status: 'active',
    task_lists: [],
    modules_order: [],
};

const moduleWithoutTaskList = {
    _id: MODULE_ID,
    name: 'Test module 1',
    project: PROJECT_ID,
};

const taskLists = [
    {
        _id: new ObjectID(),
        name: 'Test List',
        tasks: [],
    },
];

const moduleWithTaskList = {
    _id: MODULE_ID,
    name: 'Test module 1',
    project: PROJECT_ID,
    ...defaults,
    taskLists,
};

describe('Module Helper', () => {
    let modules = [];

    beforeAll(async () => {
        // const module = new Module(collection);
        await mongoDB.deleteMany(collection, {});
    });

    beforeEach(async () => {
        const module = new Module(collection);
        modules = await module.getAll(PROJECT_ID);
    });

    test('should create a module without task list', async () => {
        const module = new Module(collection, moduleWithoutTaskList);

        await module.create();

        if (!module) throw new Error('no module created');

        const newModules = await module.getAll();

        expect(newModules.length).toBe(modules.length + 1);
    });

    test('should soft delete a module without task list', async () => {
        const module = new Module(collection, moduleWithoutTaskList);

        await module.softDelete();

        const updatedModule = await module.get(MODULE_ID);

        expect(updatedModule.deleted_at).not.toBeNull();
    });

    // test('should hide notification tasks when delete a module', async () => {

    //     const module = new Module(collection, moduleWithoutTaskList)

    //     await module.softDelete();

    //     const updatedModule = await module.get(MODULE_ID);

    // });
});
