import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    rewardPoints:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['pending','in-progress','completed'],
        default:'pending'
    },
    requester:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    helper:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null
    },
}, { timestamps: true })

const Task = mongoose.model('Task', taskSchema);

export default Task;