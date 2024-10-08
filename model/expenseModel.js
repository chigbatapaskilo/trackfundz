const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    expense: {
      type: String,
      trim: true,
      require: true,
    },
    amount: {
      type: Number,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    datePaid: {
      type: String,
    },
    day: {
      type: String,
    },
    Trackuser: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { timestamps: true }
);

const ExpenseModel = mongoose.model("expenses", expenseSchema);

module.exports = ExpenseModel;
