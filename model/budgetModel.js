
const mongoose=require('mongoose')

const budgetSchema=new mongoose.Schema({
    description:{
        type:String
    },
    target:{
        type:Number,
        require:true
    },
    duration:{
        type:String
    },
    amount:{
        type:Number
    },
    targetReached:{
        type:Number,
        default:0
    },
    targetRemaining:{
        type:Number,
         
    },
    datePaid:{
        type:String
    },
    Status:{
        type:String,
        enum:['inprogress','completed'],
        default:'inprogress'
    },
    percentage:{
        type:String,
        default:0
    },
    Trackuser:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'financialMangement'
    }],
},{timestamps:true})

const budgetModel=mongoose.model('budget',budgetSchema)
module.exports=budgetModel