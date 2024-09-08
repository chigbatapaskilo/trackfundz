const mongoose=require('mongoose');
const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        trim:true,
        require:true
    },
    addExpense:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'expenses'
    }],
 
},{timestamps:true})
const categorys=mongoose.model("categories",categorySchema)
module.exports=categorys