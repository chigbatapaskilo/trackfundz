const express=require('express');
const { createExpense, expenseHistory ,getTotalExpenseAmount, expenseHistoryForAcategory, deleteExpense, getOneExpense} = require('../controller/expenseController');
const { authorize } = require('../middleware/auth');
const { createIncome } = require('../controller/incomecontroller');
const { expenseValidation } = require('../middleware/validation');
const expenseRoute=express.Router()


expenseRoute.post('/create/:categoryId',authorize,expenseValidation,createExpense)
expenseRoute.get('/expensehistory',authorize,expenseHistory)
expenseRoute.get('/oneexpense/:expenseId',getOneExpense)
expenseRoute.get('/historyforacategory/:categoryId',authorize,expenseHistoryForAcategory)

expenseRoute.post('/createIncome',authorize,createIncome)
expenseRoute.delete('/delete',authorize,deleteExpense)

module.exports=expenseRoute