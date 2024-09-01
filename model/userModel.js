const mongoose=require('mongoose');
// creating my schema
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        require:true,
        trim:true
    },
    lastName:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        trim:true
        
    },
    phoneNumber:{
        type:Number,
        require:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        require:true,
        trim:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    blacklist:[]
  
},{timestamps:true});
const userModel=mongoose.model('financialMangement',userSchema);
module.exports=userModel