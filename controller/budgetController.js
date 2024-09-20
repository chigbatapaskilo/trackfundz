const budgetModel = require("../model/budgetModel");
const userModel = require("../model/userModel");
const targetModel=require('../model/target')

exports.createBudget = async (req, res) => {
  try {
    const { userId } = req.user;
    const { description, target, duration } = req.body;
    const checkUser = await userModel.findById(userId);
    if (!checkUser) {
      return res.status(404).json({ message: "user not found" });
    }
    const newTarget = Number(checkUser.totalTargetGoal) + Number(target);
    checkUser.totalTargetGoal = newTarget;

    const setTarget = new budgetModel({
      description,
      target,
      duration,
      targetRemaining: target,
      Trackuser: userId,
    });

    await setTarget.save();
    checkUser.budgetPlanner.push(setTarget._id);
    await checkUser.save();

    res.status(201).json({
      message: "new target set ",
      data: setTarget,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while processing your request.",
      errorMessage: error.message,
    });
  }
};

exports.saveForTarget = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const { amount } = req.body;
    const { userId } = req.user;

    const findBudget = await budgetModel.findById(budgetId);
    if (!findBudget) {
      return res.status(404).json({
        message: "budget not found",
      });
    }
    const checkUser = await userModel.findById(userId );
    if (!checkUser) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    if (findBudget.Trackuser.toString() !== userId.toString()) {
      return res.status(401).json({
        message: "unable to update another users content",
      });
    }

    

    const savingsForBudget = Number(findBudget.targetReached) + Number(amount);
   const totalSavings=Number(checkUser.totalAmountSaved) + Number(amount);
  
   checkUser.totalAmountSaved=totalSavings
   

  
    const BudgetGoal = Number(findBudget.targetRemaining) - Number(amount);
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
    const percentagePaid = (savingsForBudget / findBudget.target) * 100;
    const roundPercentage=Math.floor(percentagePaid)
    console.log(roundPercentage);
    

    
    const data = {
      datePaid: fullDate,
      amount,
      targetReached: savingsForBudget,
      percentage: roundPercentage,
      targetRemaining: BudgetGoal,
    };
    if (findBudget.targetRemaining <= 0) {
      data.Status = "completed";
      findBudget.Status = data.Status;
    }
    await targetModel.create({
        amount,
        date: fullDate,
        budgets: budgetId,
        totalAmount: savingsForBudget
    });

    const updateBudget = await budgetModel.findByIdAndUpdate(budgetId, data, {
      new: true,
    });
    await checkUser.save()
    res.status(200).json({
      message: "update successfull",

      data: updateBudget,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while processing your request.",
      errorMessage: error.message,
    });
  }
};
exports.updatestatus = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const { userId } = req.user;
    const findBudget = await budgetModel.findById(budgetId);
    if (!findBudget) {
      return res.status(400).json({
        message: "budget not found",
      });
    }
    if (findBudget.Trackuser.toString() !== userId.toString()) {
      return res.status(401).json({
        message: "unable to update another users content",
      });
    }
    if (findBudget.targetRemaining !== 0) {
      return res.status(400).json({
        message: "target not achieved yet",
      });
    }

    findBudget.Status = "completed";
    findBudget.save();
    res.status(200).json({
      message: "completed",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while processing your request.",
      errorMessage: error.message,
    });
  }
};

exports.budgetHistory = async (req, res) => {
  try {
    const { userId } = req.user;
    const budget = await budgetModel.find({ Trackuser: userId });
    res.status(200).json({
      message: "budget history retrieved successfully",
      data: budget,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching budget history.",
      errorMessage: error.message,
    });
  }
};
exports.getOneBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const budget = await budgetModel.findById(budgetId);
    if (!budget) {
      return res.status(404).json({
        message: "budget not found",
      });
    }
    res.status(200).json({
      message: "get me the user",
      data: budget,
      amounts: budget.amount
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      errorMessage: error.message,
    });
  }
};
exports.deleteBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const budgetTargeted = await budgetModel.findById(budgetId);
    if (!budgetTargeted) {
      return res.status(404).json({
        message: "budget  not found",
      });
    }
    const deleteContent = await budgetModel.findByIdAndDelete(budgetId);
    const { userId } = req.user;
    const users = await userModel.findById(userId);
    users.budgetPlanner.pull(budgetId);
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
