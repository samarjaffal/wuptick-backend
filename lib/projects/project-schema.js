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
        owner: User
        members: [User]
        date_created: String
        team_owner: Team
    }
`;

module.exports = typeDefs;
