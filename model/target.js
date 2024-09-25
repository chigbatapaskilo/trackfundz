const mongoose = require("mongoose");

const targetSchema = new mongoose.Schema({
  amount: {
    type: Number,
  },
  description: {
    type: String,
  },
  date: {
    type: String,
  },
  Type: {
    type: String,
    enum:["expense","debt","budget"]
  },
  day: {
    type: String,
  },
  budgets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "budget",
    },
  ],
  debts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "debt",
    },
  ],
  expenseTracker:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "expenses",
    },
  totalAmount: {
    type: Number,
  },
  debtPaid: {
    type: Number,
  },
  Trackuser: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
},{timestamps:true});
const targetModel = mongoose.model("target", targetSchema);

module.exports = targetModel;
