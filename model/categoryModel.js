const mongoose=require('mongoose');
const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        trim:true,
        require:true
    },
    expenseTracker:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"expenses"
    }],
    budgetPlanner:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"budget"
    }],
    debtManager:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"debt"
    }]
 
},{timestamps:true})
const categorys=mongoose.model("categories",categorySchema)
module.exports=categorys