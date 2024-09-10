const express=require('express');
const budgetRoute=express.Router()
const { authorize}=require('../middleware/auth');
const { createBudget, saveForTarget, budgetHistory, budgetHistoryForAcategory, getOneBudget, deleteBudget,  } = require('../controller/budgetController');

budgetRoute.post('/create/:categoryId',authorize,createBudget)
budgetRoute.put('/:budgetId/save/:categoryId',authorize,saveForTarget)
budgetRoute.get('/history',authorize,budgetHistory)
budgetRoute.get('/onebudget/:budgetId',authorize,getOneBudget)
budgetRoute.get('/budgetforcategory/:categoryId',authorize,budgetHistoryForAcategory)
budgetRoute.delete('/:budgetId/delete/:categoryId',authorize,deleteBudget)
module.exports=budgetRoute