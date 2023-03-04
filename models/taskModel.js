const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    taskName : {
        type:String,
        required:[true, 'Taskname is required'],
    
    },
    taskDate : {
        type:Date,
        required:true
    },
    taskStatus : {
        type:String,
        enum: ['completed','incompleted'],
        required:true
    },
    position :{
        type:Number,
        },
    user :{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    } 
})

const Task = mongoose.model('Task',taskSchema);

module.exports = Task;