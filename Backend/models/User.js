import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        required:true
    },
    roomNo:{
        type:String,
        required:true,
    },
    karmaPoints:{
        type:Number,
        default:100
    }
},
{ timestamps: true })

const User = mongoose.model('User',userSchema);

export default User;