const express=require('express');
const budgetRoute=express.Router()
const { authorize}=require('../middleware/auth');
const { createBudget, saveForTarget, budgetHistory,  getOneBudget, deleteBudget,  } = require('../controller/budgetController');

budgetRoute.post('/create',authorize,createBudget)
budgetRoute.put('/save//:budgetId',authorize,saveForTarget)
budgetRoute.get('/history',authorize,budgetHistory)
budgetRoute.get('/onebudget/:budgetId',authorize,getOneBudget)
budgetRoute.delete('/delete/:budgetId',authorize,deleteBudget)
module.exports=budgetRoute