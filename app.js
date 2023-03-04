const express = require('express');
const userRoute = require('./routes/userRoutes');
const taskRoute = require('./routes/taskRoutes');

const app = express();

app.use(express.json());

app.use('/api/v1/users',userRoute);
app.use('/api/v1/task',taskRoute);

module.exports = app;