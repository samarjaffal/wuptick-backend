const express = require('express');
const { config } = require('./config/index');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');

const schemas = require('./lib/schemas');
const server = new ApolloServer({
    schema: schemas,
    context: ({ req }) => ({
        isAuth: req.isAuth,
        _id: req._id,
    }),
});
const isAuth = require('./middleware/is-auth');

const app = express();
app.use(isAuth);

server.applyMiddleware({ app });

app.use(cors());

app.listen(config.dbPort, function () {
    console.log(
        `listening http://localhost:${config.dbPort}` + server.graphqlPath
    );
});
