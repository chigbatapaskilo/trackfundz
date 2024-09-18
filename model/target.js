const mongoose=require('mongoose');

const targetSchema=new mongoose.Schema({
    amount:{
        type:Number
    },
    date:{
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
    }
})
const targetModel =mongoose.model("target",targetSchema)

module.exports = targetModel;
