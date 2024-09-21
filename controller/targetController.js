const targetModel=require('../model/target')
const budgetModel=require('../model/budgetModel')

exports.findBudgetHistory=async(req,res)=>{
    try {
       const {budgetId}=req.params 
       const getTarget=await targetModel.find({budgets:budgetId}).sort({ createdAt: 1 });
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
       const getdebtPaid=await targetModel.find({debts:debtId}).sort({ createdAt: 1 });
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
        const {userId}=req.user
        const budgetHistory=await targetModel.find({Trackuser:userId}).populate('budgets').sort({ date:-1 });
        const filteredHistory = budgetHistory.map(entry => ({  
            date: entry.date, // Assuming `date` is directly part of the entry  
            amount: entry.amount,
            budget:entry.budget,  
        }));  

        // Sending the filtered result in the response  
        res.status(200).json({  
            data: filteredHistory  
        })
        // res.status(200).json({
        //     data:budgetHistory
        //    })
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message})
    }
}
exports.findFullPaymentHistory = async (req, res) => {  
    try {  
        const { userId } = req.user;  

        // Fetching debt history based on the provided debtId  
        const debtHistory = await targetModel.find({Trackuser:userId}).populate('debts').sort({ date: -1 });  

        // Transforming the debtHistory to only include necessary fields  
        const filteredDebtHistory = debtHistory.map(entry => ({  
            date: entry.date, // Assuming 'date' is directly part of the entry  
            amount: entry.amount, 
            debt:entry.debt,  
        }));  

        // Sending the filtered result in the response  
        res.status(200).json({  
            data: filteredDebtHistory  
        });  
    } catch (error) {  
        res.status(500).json({  
            message: 'An error occurred while processing your request.',  
            errorMessage: error.message  
        });  
    }  
};