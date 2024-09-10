const debtModel=require('../model/loanModel');
const categorys=require('../model/categoryModel');
const userModel=require('../model/userModel')

exports.createdebt=async(req,res)=>{
    try {
        const {userId}=req.user
        const{ description,debtOwed,duration}=req.body
        const checkUser=await userModel.findById(userId)
        if(!checkUser){
            return res.status(404).json({message:'user not found'})
        }
        const {categoryId}=req.params
        const checkCategory=await categorys.findById(categoryId)
        if(!checkCategory){
            return res.status(404).json({message:'category  not found'})
        }
        
          const Totaldebt=Number(checkUser.totalDebtAmount) +Number(debtOwed)
          checkUser.totalDebtAmount=Totaldebt
          const Debt=new debtModel({
            description,
            debtOwed,
            duration,
            debtRemaining:debtOwed,

          })
          await Debt.save()
          checkCategory.debtManager.push(Debt._id)
          await checkCategory.save()
          checkUser.debtManager.push(Debt._id)
        await checkUser.save()

       res.status(201).json({
        message:'new target set ',
        data:Debt
       })
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message})
    }
}

exports.payDebt=async(req,res)=>{
    try {
        
        const {debtId,categoryId}=req.params
        const {amount}=req.body
        const date=new Date
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];  
        const dayName = days[date.getUTCDay()];
        const localMonth = date.getMonth() + 1; // Convert to 1-indexed  
        const localYear = date.getFullYear() 
        const fullDate=dayName+" "+ localMonth+"/"+ localYear
        const {userId}=req.user
        
        const findDebt=await debtModel.findById(debtId)
        if(!findDebt){
            return res.status(404).json({
                message:'budget not found'
            })
        }
        const checkUser=await userModel.findById(userId)
        if(!checkUser){
            return res.status(404).json({
                message:'user not found'
            })
        }
        const checkCategory=await categorys.findById(categoryId)
        if(!checkCategory){
            return res.status(404).json({
                message:'category not found'
            })
        }
        if(findDebt.Trackuser.toString() !== userId.toString()){
            return res.status(401).json({
             message:'unable to update another users content'
            })
         }
         if(findDebt.category.toString() !== categoryId.toString()){
            return res.status(401).json({
             message:'unable to update another category content'
            })
         }
        
         

         const acheiveGoal=Number(checkUser.totaldebtPaid)+Number(amount)
         checkUser.totaldebtPaid=acheiveGoal
         const categoryDebtRemaining=Number(findDebt.debtRemaining)-Number(amount)

        
        const debtData={
            datePaid:fullDate,
            amountPaid:amount,
            debtRemaining:categoryDebtRemaining
        }

        const updateDebtPayment=await debtModel.findByIdAndUpdate(debtId, debtData,{new:true})
        await checkUser.save()
        res.status(200).json({
            message:'update successfull',
            data:updateDebtPayment
        })
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message})
    }
}

exports.DebtHistoryForAcategory = async (req, res) => {  
    try { 
        const { userId} = req.user;  
        const { categoryId } = req.params;  
        const debt = await debtModel.find({ category: categoryId,Trackuser:userId }).sort({ createdAt: -1 });;  
        res.status(200).json({  
            message: 'debt history retrieved successfully',  
            data: debt
        });  
    } catch (error) {  
        res.status(500).json({  
            message: 'An error occurred while fetching debt history.',  
            errorMessage: error.message  
        });  
    }  
};  

exports.DebtHistory = async (req, res) => {  
    try {  
        const { userId} = req.user;  
        const debt = await debtModel.find({Trackuser:userId});  
        res.status(200).json({  
            message: 'debt history retrieved successfully',  
            data: debt 
        });  
    } catch (error) {  
        res.status(500).json({  
            message: 'An error occurred while fetching debt history.',  
            errorMessage: error.message  
        });  
    }  
};
exports.getOneDebt=async(req,res)=>{
    try {
        const {debtId}=req.params
        const debt=await debtModel.findById(debtId)
        if(!debt){
            return res.status(404).json({
                message:'debt not found'
            })
        }
     res.status(200).json({
        message:'get me the debt history',
        data:debt
     })

        
        
    } catch (error) {
        res.status(500).json({
            message:'server error',
            errorMessage:error.message
          })  
    }
}
exports.deleteDebt=async(req,res)=>{
    try {
        const {debtId}=req.params
        const {categoryId}=req.params
        const budgetTargeted=await debtModel.findById(debtId)
        if(!budgetTargeted){
         return res.status(404).json({
            message:'debt not found'
         })
        }
        const deleteContent=await debtModel.findByIdAndDelete(debtId)
        const {userId}=req.user
        const categoryExpense=await categorys.findById(categoryId)
        categoryExpense.debtManager.pull(debtId)
        categoryExpense.save()
        const users=await userModel.findById(userId)
        users. debtManager.pull(debtId)
        await users.save()
        res.status(200).json({
            message:'deteted successful'
        })
        
    } catch (error) {
        res.status(500).json({
            message:'server error',
            errorMessage:error.message
          }) 
    }
}


