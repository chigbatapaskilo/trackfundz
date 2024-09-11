const express=require('express');
const debtRoute=express.Router()
const { authorize}=require('../middleware/auth');
const { createdebt, payDebt, getOneDebt, DebtHistory, deleteDebt } = require('../controller/debtController');
const { debtValidation } = require('../middleware/debtValidation');

debtRoute.post('/create',authorize,debtValidation,createdebt)
debtRoute.put('/pay/:debtId',authorize,payDebt)
debtRoute.get('/history',authorize,DebtHistory)
debtRoute.get('/oneDebt/:debtId',authorize,getOneDebt)
debtRoute.delete('/delete/:debtId',authorize,deleteDebt)
module.exports=debtRoute