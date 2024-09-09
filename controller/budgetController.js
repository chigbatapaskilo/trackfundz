const budgetModel=require('../model/budgetModel');
const categorys=require('../model/categoryModel');
const userModel=require('../model/userModel')

exports.createBudget=async(req,res)=>{
    try {
        const {userId}=req.user
        const{ description,target,duration}=req.body
        const checkUser=await userModel.findById(userId)
        if(!checkUser){
            return res.status(404).json({message:'user not found'})
        }
        const {categoryId}=req.params
        const checkCategory=await categorys.findById(categoryId)
        if(!checkCategory){
            return res.status(404).json({message:'category  not found'})
        }
        
          const newTarget=Number(checkUser.totalTargetGoal) +Number(target)
          checkUser.totalTargetGoal=newTarget
          const setTarget=new budgetModel({
            description,
            target,
            duration,
            Status,
            targetRemaining:target,
            Trackuser:userId,
            category:categoryId

          })
          await setTarget.save()
          checkCategory.budgetPlanner.push(setTarget._id)
          await checkCategory.save()
          checkUser.budgetPlanner.push(setTarget._id)
        await checkUser.save()

       res.status(201).json({
        message:'new target set '
       })
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message})
    }
}

exports.saveForTarget=async(req,res)=>{
    try {
        const {budgetId}=req.params
        const {amount}=req.body
        const {userId}=req.user
        const {categoryId}=req.params
        const findBudget=await budgetModel.findById(budgetId)
        if(!findBudget){
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
        const checkCategory=await userModel.findById(categoryId)
        if(!checkCategory){
            return res.status(404).json({
                message:'category not found'
            })
        }
        if(findBudget.Trackuser.toString() !== userId.toString()){
            return res.status(401).json({
             message:'unable to update another users content'
            })
         }
         if(findBudget.category.toString() !== categoryId.toString()){
            return res.status(401).json({
             message:'unable to update another category content'
            })
         }
         if(findBudget.Status="completed"){
            return res.status(401).json({
                message:'you have already acheived the target'
               }) 
         }

         const acheiveGoal=Number(checkUser.totalAmountReached)+Number(amount)
         checkUser.totalAmountReached=acheiveGoal
         const categoryGoal=Number(findBudget.targetRemaining)-Number(amount)
         if(findBudget.targetRemaining ==findBudget.target){

         }
        const data={
            amount,
            targetRemaining:categoryGoal
        }
        const updateBudget=await budgetModel.findByIdAndUpdate(budgetId,data,{new:true})
        res.status(200).json({
            message:'update successfull',
            updateBudget
        })
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message})
    }
}

exports.budgetHistoryForAcategory = async (req, res) => {  
    try { 
        const { userId} = req.user;  
        const { categoryId } = req.params;  
        const budget = await budgetModel.find({ category: categoryId,Trackuser:userId }).populate('category').sort({ createdAt: -1 });;  
        res.status(200).json({  
            message: 'budget history retrieved successfully',  
            data: budget  
        });  
    } catch (error) {  
        res.status(500).json({  
            message: 'An error occurred while fetching budget history.',  
            errorMessage: error.message  
        });  
    }  
};  

exports.budgetHistory = async (req, res) => {  
    try {  
        const { userId} = req.user;  
        const budget = await budgetModel.find({Trackuser:userId});  
        res.status(200).json({  
            message: 'budget history retrieved successfully',  
            data: budget 
        });  
    } catch (error) {  
        res.status(500).json({  
            message: 'An error occurred while fetching budget history.',  
            errorMessage: error.message  
        });  
    }  
};
exports.getOneBudget=async(req,res)=>{
    try {
        const {budgetId}=req.params
        const budget=await budgetModel.findById(budgetId)
        if(!budget){
            return res.status(404).json({
                message:'budget not found'
            })
        }
     res.status(200).json({
        message:'get me the user',
        data:budget
     })

        
        
    } catch (error) {
        res.status(500).json({
            message:'server error',
            errorMessage:error.message
          })  
    }
}
exports.deleteExpense=async(req,res)=>{
    try {
        const {budgetId}=req.params
        const {categoryId}=req.params
        const budgetTargeted=await budgetModel.findById(budgetId)
        if(!budgetTargeted){
         return res.status(404).json({
            message:'budget  not found'
         })
        }
        const deleteContent=await budgetModel.findByIdAndDelete(budgetId)
        const {userId}=req.user
        const categoryExpense=await categorys.findById(categoryId)
        categoryExpense.budgetPlanner.pop(budgetId)
        categoryExpense.save()
        const users=await userModel.findById(userId)
        users. budgetPlanner.pop(budgetId)
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