const Task = require('../models/taskModel');
const catchAsync = require('../utils/catchAsync');
const Apperror = require('../utils/apperror');


exports.createTask = async (req,res) =>{
    const {taskName,taskDate,taskStatus} = req.body
    const user = req.user //Getting thsi from JWT decode
    const taskLength = user.tasks.length;
    const newTask = await Task.create({taskName,taskDate,taskStatus,user:user._id,position:taskLength+1});
    user.tasks.push(newTask);
    await user.save({validateBeforeSave: false});
    res.status(201).json({
        status : "success",
        data:{
            newTask
        }
    })
    
}

exports.getAllTask = async(req,res)=>{ 
    let result = Task.find({user: req.user._id}).sort('position');
    //Pagination loguc
    const page = req.query.page *1 || 1;
    const limit = req.query.limit *1 || 2;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const tasks = await result;
    res.status(201).json({
        status : "success",
        data:{
            tasks
        }
    })

}

exports.updateTask = async (req,res)=>{
    console.log("hi")
    if(!req.user.tasks.includes(req.params.id)){
        res.status(401).json({
            status : "Failed",
            message : "Task is not presnet"
    })
}
    const updatedTask = await Task.findByIdAndUpdate(req.params.id,req.body,{new :true});
    res.status(201).json({
        status : "success",
        data:{
            updatedTask
        }
    })

}

exports.deleteTask = async(req,res)=>{    
    if(!req.user.tasks.includes(req.params.id)){
        res.status(401).json({
            status : "Failed",
            message : "Task is not presnet"
    })
    }
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    res.status(201).json({
        status : "Task is deleted",
    })

    req.user.tasks.pop(req.params.id);
    await req.user.save({validateBeforeSave : false});


}

exports.reArrangedTask = catchAsync (async(req,res)=>{
    let presentTask = await Task.find({user :req.user._id});
    const {newSequence} = req.body;
    if(!(newSequence.length == presentTask.length)){
        return next(new Apperror("Sequence spoecified doesn't amtch with the present sequence",404));
    }
    const duplicates = newSequence.filter((el,index)=>{
        return newSequence.indexOf(el) !== index;

    })
    if(duplicates.length>0){
        return next(new Apperror("Duplicate sequence number found in given sequenxe please valid sequence",404));
    }
    for(let i=0;i<presentTask.length;i++){
        if(newSequence[i] == presentTask[i].position) continue;
        presentTask[i].position = newSequence[i];
        await presentTask[i].save({validateBeforeSave:false});
    }
    const updatedTask = await Task.find({user:req.user._id}).sort('position')
    res.status(201).json({
        status : "success",
        data:{
            updatedTask
        }
    })

})