'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');

const collection = 'topics';
const mongoDB = new MongoLib();

const defaults = {
    description: '',
    tag: null,
    url: '',
    collaborators: [],
};

module.exports = {
    createTopic: async (root, { input }, context) => {
        if (!context.isAuth) {
            return null;
        }
        let topic;
        input.owner = ObjectID(input.owner._id);
        input.module = ObjectID(input.module._id);
        if ('tag' in input) input.tag = ObjectID(input.tag._id);
        input.created_at = new Date().toISOString();
        topic = await crudHelper.create(collection, input, defaults);
        return topic;
    },

    editTopic: async (root, { topicId, input }) => {
        let topic;
        try {
            let inputData = { ...input };
            if ('tag' in inputData) inputData.tag = ObjectID(inputData.tag._id);
            topic = await crudHelper.edit(
                collection,
                topicId,
                inputData,
                'topic'
            );
        } catch (error) {
            console.error(error);
        }
        return topic;
    },

    deleteTopic: async (root, { topicId }) => {
        let topic;
        topic = await crudHelper.delete(collection, topicId, 'topics');
        return topic;
    },

    addCollaboratorOnTopic: async (root, { topicId, userId }) => {
        let topic;
        const operator = {
            format: {
                collaborators: ObjectID(userId),
            },
            key: 'collaborators',
            set: 'collaborators',
        };
        topic = await crudHelper.addSet(collection, topicId, operator, 'topic');
        return topic;
    },
    removeCollaboratorFromTopic: async (root, { topicId, userId }) => {
        let topic;
        const operator = { collaborators: ObjectID(userId) };
        topic = await crudHelper.removeSet(
            collection,
            topicId,
            'topic',
            operator
        );
        return topic;
    },
};
