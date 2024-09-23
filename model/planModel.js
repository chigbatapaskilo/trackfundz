const mongoose=require('mongoose');

const planSchema=new mongoose.Schema({
name:{
    type:String,
    unique:true
},
amount:{
    type:Number,
    unique:true
}
},{timestamps:true})

const planModel=mongoose.model('plan',planSchema)
module.exports=planModel