const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Setting {
        _id: ID!
        key: String
        value: String
    }

    input SettingInput {
        key: String!
        value: String!
    }

    extend type Query {
        "Retrieve all settings"
        getSettings: [Setting]
        "Get a single setting"
        getSetting(key: String!): Setting
    }

    extend type Mutation {
        "Create a Setting"
        createSetting(input: SettingInput!): Setting
    }
`;

module.exports = typeDefs;
