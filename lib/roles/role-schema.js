const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Role {
        _id: ID!
        name: String!
    }

    input RoleInput {
        name: String!
    }

    extend type Query {
        "Retrieve all roles"
        getRoles: [Role]
    }

    extend type Mutation {
        "Create a Role"
        createRole(input: RoleInput!): Role
    }
`;

module.exports = typeDefs;
