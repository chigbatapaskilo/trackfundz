const express=require('express');
const debtRoute=express.Router()
const { authorize}=require('../middleware/auth');
const { createdebt, payDebt, getOneDebt, DebtHistory, deleteDebt } = require('../controller/debtController');
const { debtValidation } = require('../middleware/debtValidation');
const { finddebtHistory, findFullPaymentHistory } = require('../controller/targetController');

debtRoute.post('/create',authorize,debtValidation,createdebt)
debtRoute.put('/pay/:debtId',authorize,payDebt)
debtRoute.get('/history',authorize,DebtHistory)
debtRoute.get('/oneDebt/:debtId',authorize,getOneDebt)
debtRoute.get('/debtHistory/:debtId',authorize,finddebtHistory)
debtRoute.get('/debtpaymentHistory',authorize,findFullPaymentHistory)
debtRoute.delete('/delete/:debtId',authorize,deleteDebt)
module.exports=debtRoute