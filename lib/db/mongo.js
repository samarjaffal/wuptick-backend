const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../../config/index');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;
const DB_HOST = config.dbHost;
//const DB_PORT = config.dbPort;

const liveUri = `mongodb+srv://${USER}:${PASSWORD}@${DB_HOST}/${DB_NAME}`;
const localUri = `mongodb://localhost/${DB_NAME}}`;

const MONGO_URI = process.env.NODE_ENV == 'production' ? liveUri : localUri;

class MongoLib {
    constructor() {
        this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true });
        this.dbName = DB_NAME;
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
            .then((result) => result.insertedId);
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
                .updateOne({ _id: ObjectId(id) }, { $pull: query });
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
            .then((result) => result.upsertedId);
    }

    aggregate(collection, query) {
        return this.connect().then((db) => {
            return db.collection(collection).aggregate(query).toArray();
        });
    }
}

module.exports = MongoLib;
