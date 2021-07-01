const MongoLib = require('../lib/db/mongo');
const mongoDB = new MongoLib();
const { ObjectID } = require('mongodb');

const collection = 'modules';

const defaults = {
    _id: null,
    name: '',
    project: null,
    description: '',
    status: 'active',
    task_lists: [],
    modules_order: [],
};

class Module {
    constructor(_collection, module = defaults) {
        this.collection = _collection || collection;
        this.module = { ...defaults, ...module };
    }

    get = async (id = null) => {
        const module = await mongoDB.get(this.collection, id || this._id);
        return module || {};
    }

    getAll = async (projectId = null) => {
        const modules = await mongoDB.getAll(this.collection, { project: projectId || this.module.project });
        return modules || [];
    }

    create = async () => {
        if (this.module.name === '' || this.module.name === null) throw new Error("Module name is required.");
        const moduleId = await mongoDB.create(this.collection, this.module);
        module._id = moduleId;
        return module || {};
    }

    softDelete = async (id = null) => {
        await mongoDB.update(this.collection, id || this.module._id, { deleted_at: new Date() });
        return id;
    }
}

module.exports = Module;