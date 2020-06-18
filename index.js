const express = require('express');
const { config } = require('./config/index');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');

const schemas = require('./lib/schemas');
const server = new ApolloServer({ schema: schemas });

const app = express();
server.applyMiddleware({ app });

app.use(cors());

app.listen(config.dbPort, function () {
    console.log(
        `listening http://localhost:${config.dbPort}` + server.graphqlPath
    );
});
