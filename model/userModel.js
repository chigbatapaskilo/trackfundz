const mongoose = require("mongoose");
// creating my schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      trim: true,
    },
    lastName: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      require: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String, // Changed to store the URL directly  
      // default: '', // Optional: set a default value  
    },
    availableBalance: {
      type: Number,
      trim: true,
      default: 0,
    },
    totalExpenses: {
      type: Number,
      default: 0,
    },
    totalTargetGoal: {
      type: Number,
      trim: true,
      default: 0,
    },
    totalAmountSaved: {
      type: Number,
      trim: true,
      default: 0,
    },
    totalDebtAmount: {
      type: Number,
      trim: true,
      default: 0,
    },
    totaldebtPaid: {
      type: Number,
      trim: true,
      default: 0,
    },

    expenseTracker: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "expenses",
      },
    ],
    budgetPlanner: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "budget",
      },
    ],
    debtManager: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "debt",
      },
    ],
    userIncome: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "income",
      },
    ],
    blacklist: [],
  },
  { timestamps: true }
);
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;