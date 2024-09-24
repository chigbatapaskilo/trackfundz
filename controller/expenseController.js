const ExpenseModel = require("../model/expenseModel");

const userModel = require("../model/userModel");
const categorys = require("../model/categoryModel");

// exports.createIncome=async(req,res)=>{
//     try {
//         const {income,paymentName}=req.body
//         if(!payment||!payment){
//             return res.status(400).json({
//                 message:'all feilds are required'
//             })
//         }
//         if(income <= 0){
//             return res.status(404).json({
//                 messaage: `invalid income amount.Amount must be postive value`
//             })
//         }
//         const addIncome=new ExpenseModel({
//             income,
//             paymentName,
//             availableBalance:income
//         })
//         await addIncome.save()
//         res.status(201).json({
//             message:'income added',
//             data:addIncome
//         })

//     } catch (error) {
//         res.status(500).json({
//             message: 'An error occurred while processing your request.',
//             errorMessage:error.message})
//     }
// }

// exports.createExpense=async(req,res)=>{
//     try {
//         const {userId}=req.user
//         const checkUser=await userModel.findById(userId)
//         if(!checkUser){
//             return res.status(404).json({
//                 messaage: `user not found`
//             })
//         }
//         const {categoryId}=req.params
//         const checkCategory=await categoryModel.findById(categoryId)
//         if(!checkCategory){
//             return res.status(404).json({
//                  messaage: `category  not found`
//             })
//         }
//         const {expense,amount,discription}=req.body
//         const getBalance=await ExpenseModel.findOne()
//         if(amount <= 0){
//             return res.status(404).json({
//                 messaage: `invalid amount.Amount must be postive value`
//             })
//         }
//         if(amount > balance){
//             return res.status(404).json({
//                 messaage: 'cannot add expense insufficient balance.please add income'
//             })
//         }

//         const expenseBalance=balance-amount
//         const expenseMade=new ExpenseModel({
//             expense,
//             amount,
//             discription,
//             userId:checkUser.userId
//         })

//     } catch (error) {
//         res.status(500).json({
//             message: 'An error occurred while processing your request.',
//             errorMessage:error.message})

//     }
//     }

// exports.getTotalExpenseAmount = async (req, res) => {
//     try {
//         const { userId } = req.user; // Get the user ID from the request
//         const expenses = await ExpenseModel.find({ userId }); // Find all expenses for the user

//         // Calculate the total expense amount
//         const totalExpense = expenses.totalExpenses;

//         res.status(200).json({
//             message: 'Total expense amount retrieved successfully',
//             totalExpense
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: 'An error occurred while fetching total expense amount.',
//             errorMessage: error.message
//         });
//     }
// };

const targetModel = require("../model/target");

exports.createExpense = async (req, res) => {
  try {
    const { userId } = req.user;
    const checkUser = await userModel.findById(userId);
    const date = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = days[date.getUTCDay()];
    const localMonth = date.getMonth() + 1; // Convert to 1-indexed
    const localYear = date.getFullYear();
    const fullDate = dayName + " " + localMonth + "/" + localYear;

    if (!checkUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { expense, amount, description } = req.body;
    const amountValue = Number(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      return res.status(400).json({
        message: "Invalid amount. Amount must be a positive value",
      });
    }
    const availableBalance = Number(checkUser.availableBalance) || 0;
    if (amountValue > availableBalance) {
      return res.status(400).json({
        message: "Cannot add expense. Insufficient balance. Please add income",
      });
    }

    const expenseBalance = Number(checkUser.availableBalance) - Number(amount);
    checkUser.availableBalance = expenseBalance;
    const expenseTotal = Number(checkUser.totalExpenses) + Number(amount);
    checkUser.totalExpenses = expenseTotal;
    const expenseMade = new ExpenseModel({
      expense,
      amount: amountValue,
      description,
      datePaid: fullDate,
      Trackuser: userId,
    });

    const expenseData = new targetModel({
      day: dayName,
      expenseAmount: amountValue,
      expenseName: expense,
      date:fullDate,
      Trackuser: userId,
    });
    expenseData.expenseTracker.push(expenseData._id);
    await expenseData.save();

    await expenseMade.save();
    checkUser.expenseTracker.push(expenseMade._id);
    await checkUser.save();
    res.status(201).json({
      message: "Expense added",
      data: expenseMade,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while processing your request.",
      errorMessage: error.message,
    });
  }
};

exports.expenseHistory = async (req, res) => {
  try {
    const { userId } = req.user;
    const expenses = await ExpenseModel.find({ Trackuser: userId }).sort({
      createdAt: 1,
    });

    // const expenses = await ExpenseModel.find({Trackuser:userId}).createdAt;
    res.status(200).json({
      message: "Expense history retrieved successfully",
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching expense history.",
      errorMessage: error.message,
    });
  }
};
exports.getOneExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const expense = await ExpenseModel.findById(expenseId);
    if (!expense) {
      return res.status(404).json({
        message: "expense not found",
      });
    }
    res.status(200).json({
      message: "get me the user",
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      errorMessage: error.message,
    });
  }
};
exports.deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const expenseMade = await ExpenseModel.findById(expenseId);
    if (!expenseMade) {
      return res.status(404).json({
        message: "expense  not found",
      });
    }
    const deleteContent = await ExpenseModel.findByIdAndDelete(expenseId);
    const { userId } = req.user;
    const users = await userModel.findById(userId);
    users.expenseTracker.pull(expenseId);
    await users.save();
    res.status(200).json({
      message: "deteted successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      errorMessage: error.message,
    });
  }
};
exports.weeklyExpenses = async (req, res) => {
  try {
    const { userId } = req.user; // Extracting userId from req.user
    console.log("User ID:", userId); // Log user ID

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Log expenses before aggregation
    const expensesBeforeAggregation = await targetModel.find({ Trackuser: userId});
    console.log("Expenses before aggregation:", expensesBeforeAggregation);

    const expenses = await targetModel.aggregate([
      { $match: { Trackuser: userId } },
      {
        $group: {
          _id: { $dayOfWeek: "$day" },
          totalAmount: { $sum: "$expenseAmount" }
        }
      },
      {
        $project: {
          day: { $arrayElemAt: [days, { $subtract: ["$_id", 1] }] },
          totalAmount: 1,
          _id: 0
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    res.status(200).json({
      message: 'Weekly expense summary',
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving weekly expenses',
      errorMessage: error.message
    });
  }
};
