
const mongoose=require('mongoose')

const budgetSchema=new mongoose.Schema({
    description:{
        type:String
    },
    debtOwed:{
        type:Number,
        require:true
    },
    duration:{
        type:String
    },
    amount:{
        type:Number
    },
    amountPaid:{
        type:Number,
        default:0
    },
    debtRemaining:{
        type:Number,
       
    },
    percentage:{
       type:Number,
       default:0
    },
    Status:{
        type:String,
        enum:['inprogress','completed'],
        default:'inprogress'
    },
    datePaid:{
        type:Date
    },
    Trackuser:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'financialMangement'
    }],
},{timestamps:true})

const debtModel=mongoose.model('debtManager',budgetSchema)
module.exports=debtModel