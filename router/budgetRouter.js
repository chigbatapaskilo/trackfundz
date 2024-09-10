const express=require('express');
const budgetRoute=express.Router()
const { authorize}=require('../middleware/auth');
const { createBudget, saveForTarget, budgetHistory, budgetHistoryForAcategory, getOneBudget, deleteBudget,  } = require('../controller/budgetController');

debtRoute.post('/create/:categoryId',authorize,createBudget)
debtRoute.put('/:budgetId/save/:categoryId',authorize,saveForTarget)
debtRoute.get('/history',authorize,budgetHistory)
debtRoute.get('/onebudget/:budgetId',authorize,getOneBudget)
debtRoute.get('/budgetforcategory/:categoryId',authorize,budgetHistoryForAcategory)
debtRoute.delete('/:budgetId/delete/:categoryId',authorize,deleteBudget)
module.exports=budgetRoute