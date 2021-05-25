const express = require('express');
const { config } = require('./config/index');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const schemas = require('./lib/schemas');
const cookieParser = require('cookie-parser');
const refreshToken = require('./routes/refreshToken');
const confirmRegistration = require('./routes/confirmRegistration');
const uploadEditorImage = require('./routes/uploadEditorImage');
const uploadEditorFile = require('./routes/uploadEditorFile');
const { uploadFile } = require('./helpers/gd-files-upload');
const app = express();

app.use(
    cors({
        origin: config.frontURL,
        credentials: true,
    })
);

app.use(cookieParser());

//refresh token handle route
refreshToken(app);

//confirm registration handle route
confirmRegistration(app);

//upload image from editor
uploadEditorImage(app);

//upload file from editor
uploadEditorFile(app);

app.get('/test-googleauth', async (req, res) => {
    const userfolder = 'testFolder';
    uploadFile(
        '5ede1e7d2acb276b2d814bc4',
        userfolder,
        'photo.jpg',
        'test5.jpg'
    );
    res.send('hi 2');
});

const isAuth = require('./middleware/is-auth');
app.use(isAuth);

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

app.listen(config.port, function () {
    console.log(
        `listening http://localhost:${config.port}` + server.graphqlPath
    );
});
