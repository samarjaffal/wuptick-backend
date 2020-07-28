const express = require('express');
const { config } = require('./config/index');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const schemas = require('./lib/schemas');
const cookieParser = require('cookie-parser');
const refreshToken = require('./routes/refreshToken');

const app = express();
app.use(cookieParser());

//refresh token handle route
refreshToken(app);

const isAuth = require('./middleware/is-auth');
app.use(isAuth);

app.use(
    cors({
        origin: 'http://localhost:8080',
        credentials: true,
    })
);

const server = new ApolloServer({
    schema: schemas,
    context: ({ req, res }) => ({
        isAuth: req.isAuth,
        _id: req._id,
        req,
        res,
    }),
});

server.applyMiddleware({ app, cors: false });

app.listen(config.dbPort, function () {
    console.log(
        `listening http://localhost:${config.dbPort}` + server.graphqlPath
    );
});
