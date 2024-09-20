const targetModel=require('../model/target')
const budgetModel=require('../model/budgetModel')

exports.findBudgetHistory=async(req,res)=>{
    try {
       const {budgetId}=req.params 
       const getTarget=await targetModel.find({budgets:budgetId});
       res.status(200).json({
        data:getTarget
       })
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message})
    }
}
exports.finddebtHistory=async(req,res)=>{
    try {
       const {debtId}=req.params 
       const getdebtPaid=await targetModel.find({debts:debtId});
       res.status(200).json({
        data:getdebtPaid
       })
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message})
    }
}
exports.dashBoardHistory=async(req,res)=>{
    try {
        
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message})
    }
}