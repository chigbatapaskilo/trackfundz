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
      day: dayName,
    });

    const expenseData = new targetModel({
      day: dayName,
      amount: amountValue,
      description: expense,
      date: fullDate,
      Trackuser: userId,
      Type: "expense",
    });
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

    // Define the days of the week
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Fetch expenses from the database
    const expenses = await targetModel.find({ Trackuser: userId });

    console.log("Expenses fetched:", expenses);

    // Initialize an object to hold total expenses for each day
    const weeklyTotals = days.reduce((acc, day) => {
      acc[day] = 0; // Initialize each day with 0
      return acc;
    }, {});

    // Aggregate expenses by day
    expenses.forEach((expense) => {
      const dayOfWeek = expense.day; // Assuming each expense has a 'day' field
      if (weeklyTotals.hasOwnProperty(dayOfWeek)) {
        weeklyTotals[dayOfWeek] += expense.amount; // Sum up amounts for the respective day
      }
    });

    // Log total expenses for each day
    console.log("Weekly Totals:", weeklyTotals);

    return res.status(200).json({
      message: "Weekly expense summary",
      data: weeklyTotals,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving weekly expenses",
      errorMessage: error.message,
    });
  }
};

// exports.weeklyExpenses = async (req, res) => {
//   try {
//     const { userId } = req.user; // Extracting userId from req.user
//     console.log("User ID:", userId); // Log user ID
//     const date=new Date

//     const days = [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ];
//     const today=days[date.getUTCDay()]

//     // Log expenses before aggregation
//    const expensesBeforeAggregation = await targetModel.find({Trackuser:userId, day:days});
//     console.log("Expenses before aggregation:", expensesBeforeAggregation);
//     if (expensesBeforeAggregation.length > 0) {
//       // Assuming each expense document has an amount field
//       const userData = expensesBeforeAggregation.map(expense => expense.amount); // Collecting all amounts
//       console.log("User Data (Amounts):", userData);

//       // Calculate total expenses for today
//       const total = userData.reduce((a, b) => a + b, 0);
//     return res.status(200).json({message:total,day:today })
//     }

//     res.status(200).json({
//       message: 'Weekly expense summary',
//       data: expensesBeforeAggregation,
//       total
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: 'Error retrieving weekly expenses',
//       errorMessage: error.message
//     });
//   }
// };

// exports.weeklyExpenses = async (req, res) => {
//   try {
//     const { userId } = req.user; // Extracting userId from req.user
//     console.log("User ID:", userId); // Log user ID

//     // Get today's date and calculate the start of the week (7 days ago)
//     const today = new Date();
//     const sevenDaysAgo = new Date(today);
//     sevenDaysAgo.setDate(today.getDate() - 6); // Set to 6 days before today to include today

//     // Log the date range
//     console.log("Date Range:", sevenDaysAgo, "to", today);

//     // Query the database for expenses in the last 7 days
//     const expensesBeforeAggregation = await targetModel.find({
//       Trackuser: userId,
//       date: {
//         $gte: sevenDaysAgo,
//         $lte: today
//       }
//     });

//     console.log("Expenses before aggregation:", expensesBeforeAggregation);

//     if (expensesBeforeAggregation.length > 0) {
//       // Assuming each expense document has an amount field
//       const userData = expensesBeforeAggregation.map(expense => expense.amount); // Collecting all amounts
//       console.log("User Data (Amounts):", userData);

//       // Calculate total expenses for the last 7 days
//       const total = userData.reduce((a, b) => a + b, 0);
//       console.log("Total expenses for the last 7 days:", total);

//       // Optionally, you can group the expenses by day and calculate daily totals
//       const dailyTotals = {};
//       expensesBeforeAggregation.forEach(expense => {
//         const expenseDate = expense.date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
//         if (!dailyTotals[expenseDate]) {
//           dailyTotals[expenseDate] = 0;
//         }
//         dailyTotals[expenseDate] += expense.amount; // Sum amounts for each day
//       });

//       console.log("Daily totals:", dailyTotals);
//     } else {
//       console.log("No expenses found for the last 7 days.");
//     }

//     res.status(200).json({
//       message: 'Weekly expense summary',
//       data: expensesBeforeAggregation
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: 'Error retrieving weekly expenses',
//       errorMessage: error.message
//     });
//   }
// };
