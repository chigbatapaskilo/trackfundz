const mongoose=require('mongoose');

const targetSchema=new mongoose.Schema({
    amount:{
        type:Number
    },
    date:{
        type:String
    },
    budget:{
        type:String
      
    },
    budgets:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "budget",
    }],
    debts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "debt",
    }],
    totalAmount: {
        type: Number
    },
    debtPaid: {
        type: Number
    },
    Trackuser:[{
       type:mongoose.Schema.Types.ObjectId,
    ref:'users'
    }]
})
const targetModel =mongoose.model("target",targetSchema)

module.exports = targetModel;
