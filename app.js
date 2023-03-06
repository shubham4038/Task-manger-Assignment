const express = require('express');
const userRoute = require('./routes/userRoutes');
const taskRoute = require('./routes/taskRoutes');
const Apperror = require('./utils/apperror');
const globalderrorHandler = require('./controllers/errorController')


const app = express();

app.use(express.json());

app.use('/api/v1/users',userRoute);
app.use('/api/v1/task',taskRoute);


// Creating Global error handlers
app.all('*',(req,res,next)=>{
   next(new Apperror(`cant find ${req.originalUrl} on this server`,400))
})

app.use(globalderrorHandler)
module.exports = app;