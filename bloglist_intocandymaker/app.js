const config = require('./utils/config');
const express = require('express');
const mongoose = require('mongoose');
require('express-async-errors');
const cors = require('cors');
const blogsRouter = require('./controllers/blogs.js');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const app = express();
app.use(express.static('build'));

mongoose.connect(config.MONGODB_URI).then(() =>{
    logger.info('connected to mongoDB');
}).catch((error) => {
    logger.error('error connecting to mongoDB:', error.message);
});

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);

app.use('/api/users', usersRouter);
app.use('/api/blogs', middleware.userExtractor, blogsRouter);
app.use('/api/login', middleware.userExtractor, loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
