const mongoose=require('mongoose');

const expenseSchema=new mongoose.Schema({
expense:{
    type:String,
    trim:true,
    require:true
},
amount:{
    type:Number,
    trim:true
}, 
description:{
    type:String,
    trim:true
}, 
datePaid:{
    type:String
},

category:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'categories'
}],
Trackuser:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'financialMangement'
}]
},{timestamps:true})

const ExpenseModel=mongoose.model("expenses",expenseSchema)

module.exports=ExpenseModel