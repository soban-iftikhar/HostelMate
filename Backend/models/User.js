import mongose from 'mongoose';

const userSchema = new mongose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
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
})

const User = mongose.model('User',userSchema);

export default User;