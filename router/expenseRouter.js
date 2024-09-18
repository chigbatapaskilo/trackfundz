const express=require('express');
const { createExpense, expenseHistory ,  deleteExpense, getOneExpense} = require('../controller/expenseController');
const { authorize } = require('../middleware/auth');
const { createIncome } = require('../controller/incomecontroller');
// const { expenseValidation } = require('../middleware/validation');
const expenseRoute=express.Router()


expenseRoute.post('/create',authorize,createExpense)
expenseRoute.get('/expensehistory',authorize,expenseHistory)
expenseRoute.get('/oneexpense/:expenseId',authorize,getOneExpense)
expenseRoute.post('/createIncome',authorize,createIncome)
expenseRoute.delete('/delete',authorize,deleteExpense)

module.exports=expenseRoute