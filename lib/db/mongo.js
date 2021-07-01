const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../../config/index');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_PORT = config.dbPort;
const DB_NAME = config.dbName;
const DB_HOST = config.dbHost;

const clusterUri = `mongodb+srv://${USER}:${PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
const standaloneUri = `mongodb://localhost/${DB_NAME}`;
const standaloneUriWithCredentials = `mongodb://${USER}:${PASSWORD}@${DB_HOST}:${DB_PORT}/?authSource=admin`;

if (config.appEnv == 'production') {
    MONGO_URI = clusterUri;
} else {
    if (config.appDBCredentials == 1) {
        MONGO_URI = standaloneUriWithCredentials;
    } else {
        MONGO_URI = standaloneUri;
    }
}

class MongoLib {
    constructor(_db = DB_NAME) {
        this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true });
        this.dbName = _db;
    }

    connect() {
        if (!MongoLib.connection) {
            MongoLib.connection = new Promise((resolve, reject) => {
                this.client.connect((err) => {
                    if (err) {
                        reject(err);
                    }

                    console.log('Connected succesfully to mongo');
                    resolve(this.client.db(this.dbName));
                });
            });
        }

        return MongoLib.connection;
    }

    getAll(collection, query, count = false, limit = 0, sort = {}) {
        return this.connect().then((db) => {
            if (!count) {
                return db
                    .collection(collection)
                    .find(query)
                    .limit(limit)
                    .sort(sort)
                    .toArray();
            } else {
                return db.collection(collection).find(query).count();
            }
        });
    }

    get(collection, id) {
        return this.connect().then((db) => {
            return db.collection(collection).findOne({ _id: ObjectId(id) });
        });
    }

    create(collection, data) {
        return this.connect()
            .then((db) => {
                return db.collection(collection).insertOne(data);
            })
            .then((result) => result.insertedId)
            .catch((error) => console.error(error));
    }

    createMany(collection, data) {
        return this.connect()
            .then((db) => {
                return db.collection(collection).insertMany(data);
            })
            .then((result) => result.insertedIds);
    }

    update(collection, id, data) {
        return this.connect()
            .then((db) => {
                return db
                    .collection(collection)
                    .updateOne(
                        { _id: ObjectId(id) },
                        { $set: data },
                        { upsert: true }
                    );
            })
            .then((result) => result.upsertedId || id);
    }

    updateMany(collection, query, operator) {
        return this.connect()
            .then((db) => {
                return db
                    .collection(collection)
                    .updateMany(query, operator, { upsert: true });
            })
            .then((result) => result.upsertedId);
    }

    addToSet(collection, id, query) {
        return this.connect().then((db) => {
            return db
                .collection(collection)
                .updateOne({ _id: ObjectId(id) }, { $addToSet: query });
        });
    }

    removeFromSet(collection, id, query) {
        return this.connect().then((db) => {
            return db
                .collection(collection)
                .updateOne(
                    { _id: ObjectId(id) },
                    { $pull: query },
                    { upsert: true }
                )
                .then((result) => result.upsertedId || id);
        });
    }

    delete(collection, id) {
        return this.connect()
            .then((db) => {
                return db
                    .collection(collection)
                    .deleteOne({ _id: ObjectId(id) });
            })
            .then(() => id);
    }

    deleteMany(collection, query) {
        return this.connect()
            .then((db) => {
                return db.collection(collection).deleteMany(query);
            })
            .then((result) => result.upsertedId);
    }

    findOne(collection, query) {
        return this.connect().then((db) => {
            return db.collection(collection).findOne(query);
        });
    }

    updateOne(collection, query, data) {
        return this.connect()
            .then((db) => {
                return db
                    .collection(collection)
                    .updateOne(query, { $set: data }, { upsert: true });
            })
            .then((result) => result.upsertedId);
    }

    updateSet(collection, query, data) {
        return this.connect()
            .then((db) => {
                return db
                    .collection(collection)
                    .updateOne(query, data, { upsert: true });
            })
            .then((result) => result.upsertedId)
            .catch((error) => console.log(error, 'error'));
    }

    findOneAndUpdate(collection, query, data) {
        return this.connect()
            .then((db) => {
                return db
                    .collection(collection)
                    .findOneAndUpdate(query, data, { returnNewDocument: true });
            })
            .then((result) => result.value)
            .catch((error) => console.log(error, 'error'));
    }

    aggregate(collection, query) {
        return this.connect().then((db) => {
            return db.collection(collection).aggregate(query).toArray();
        });
    }
}

module.exports = MongoLib;
