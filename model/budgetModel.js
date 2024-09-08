
const mongoose=require('mongoose')

const budgetSchema=new mongoose.Schema({
    description:{
        type:String
    },
    target:{
        type:Number
    },
    duration:{
        type:String
    },
    totalBudget:{
        type:Number
    },
    Trackuser:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'financialMangement'
    }],
    category:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'categories'
    }]
},{timestamps:true})

const budgetModel=mongoose.model('budget',budgetSchema)
module.exports=budgetModel