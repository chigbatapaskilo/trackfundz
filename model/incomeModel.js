const mongoose=require('mongoose');
const incomeSchema=new mongoose.Schema({
    

income:{
    type:Number,
    trim:true,
    require:true
},
paymentName:{
    type:String,
    trim:true
},
Trackuser:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'users'
}]
},{timestamps:true})
const IncomeModel=mongoose.model('income',incomeSchema)
module.exports=IncomeModel