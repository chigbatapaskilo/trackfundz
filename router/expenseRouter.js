const express=require('express');
const { createExpense, expenseHistory ,  deleteExpense, getOneExpense, getDailyExpenses, weeklyExpenses} = require('../controller/expenseController');
const { authorize } = require('../middleware/auth');
const { createIncome } = require('../controller/incomecontroller');
const { expenseValidation } = require('../middleware/debtValidation');
const {history } = require('../controller/targetController');
const expenseRoute=express.Router()


expenseRoute.post('/create',expenseValidation,authorize,createExpense)
expenseRoute.get('/expensehistory',authorize,expenseHistory)
expenseRoute.get('/oneexpense/:expenseId',authorize,getOneExpense)
expenseRoute.get('/dashBoardhistory',authorize,history)
expenseRoute.get('/expeseperday',authorize,weeklyExpenses)
expenseRoute.post('/createIncome',authorize,createIncome)
expenseRoute.delete('/delete',authorize,deleteExpense)

module.exports=expenseRoute