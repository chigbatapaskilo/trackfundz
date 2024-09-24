const mongoose = require("mongoose");

const targetSchema = new mongoose.Schema({
  amount: {
    type: Number,
  },
  expenseAmount: {
    type: Number,
  },
  expenseName: {
    type: String,
  },
  date: {
    type: String,
  },
  budget: {
    type: String,
  },
  debt: {
    type: String,
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
});
const targetModel = mongoose.model("target", targetSchema);

module.exports = targetModel;
