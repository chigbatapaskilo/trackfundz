const express=require('express');
const budgetRoute=express.Router()
const { authorize}=require('../middleware/auth');
const { createBudget, saveForTarget, budgetHistory,  getOneBudget, deleteBudget, updatestatus,  } = require('../controller/budgetController');
const {  findBudgetHistory, dashBoardHistory } = require('../controller/targetController');
const { budgetValidation } = require('../middleware/budgetValidation');

budgetRoute.post('/newBudget',authorize,budgetValidation,createBudget)
budgetRoute.put('/save/:budgetId',authorize,saveForTarget)
budgetRoute.put('/status/:budgetId',authorize,updatestatus)
budgetRoute.get('/history',authorize,budgetHistory)
budgetRoute.get('/onebudget/:budgetId',authorize,getOneBudget)
budgetRoute.get('/savingshistory/:budgetId',authorize,findBudgetHistory)
budgetRoute.get('/allbudgetSavingshistory',authorize,dashBoardHistory)
budgetRoute.delete('/delete/:budgetId',authorize,deleteBudget)
module.exports=budgetRoute