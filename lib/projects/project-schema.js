const { gql } = require('apollo-server-express');

const typeDefs = gql`
    enum Privacy {
        private
        team
        public
        client
    }

    type Project {
        _id: ID!
        name: String!
        description: String
        image: String
        color: String
        privacy: Privacy
        status: Status
        owner: User!
        members: [ProjectMembers]
        created_at: String!
        team_owner: Team!
        tag: Tag
    }

    type ProjectMembers {
        user: User
        role: Role
        team: Team
    }

    input ProjectInput {
        name: String!
        description: String
        image: String
        color: String
        privacy: Privacy
        status: Status
        owner: Owner!
        created_at: String!
        team_owner: TeamOwner!
        tag: TagInput
    }

    input TeamOwner {
        _id: ID!
    }

    input TagInput {
        _id: ID!
    }

    extend type Query {
        "Retrieve all projects"
        getProjects: [Project]
    }

    extend type Mutation {
        "Crate a Project"
        createProject(input: ProjectInput!): Project
        "Add members to Project"
        addMembers(
            projectId: ID!
            userId: ID!
            roleId: ID!
            teamId: ID!
        ): Project
        # "Add Project to a Team"
        # addProject(teamId: ID!, projectId: ID!): Project
    }
`;

module.exports = typeDefs;
