const express=require('express');
const debtRoute=express.Router()
const { authorize}=require('../middleware/auth');
const { createdebt, payDebt, getOneDebt, DebtHistory, DebtHistoryForAcategory, deleteDebt } = require('../controller/debtController');

debtRoute.post('/create/:categoryId',authorize,createdebt)
debtRoute.put('/:debtId/pay/:categoryId',authorize,payDebt)
debtRoute.get('/history',authorize,DebtHistory)
debtRoute.get('/oneDebt/:debtId',getOneDebt)
debtRoute.get('/create/:categoryId',authorize,DebtHistoryForAcategory)
debtRoute.delete('/:debtId/delete/:categoryId',authorize,deleteDebt)
module.exports=debtRoute