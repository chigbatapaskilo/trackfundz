const ExpenseModel=require('../model/expenseModel')
const categoryModel=require('../model/categoryModel')
const userModel = require('../model/userModel')


// exports.createIncome=async(req,res)=>{
//     try {
//         const {income,paymentName}=req.body
//         if(!payment||!payment){
//             return res.status(400).json({
//                 message:'all feilds are required'
//             })
//         }
//         if(income <= 0){
//             return res.status(404).json({
//                 messaage: `invalid income amount.Amount must be postive value`
//             })
//         }
//         const addIncome=new ExpenseModel({
//             income,
//             paymentName,
//             availableBalance:income
//         })
//         await addIncome.save()
//         res.status(201).json({
//             message:'income added',
//             data:addIncome
//         })

        
//     } catch (error) {
//         res.status(500).json({
//             message: 'An error occurred while processing your request.',
//             errorMessage:error.message})
//     }
// }

// exports.createExpense=async(req,res)=>{
//     try {
//         const {userId}=req.user
//         const checkUser=await userModel.findById(userId)
//         if(!checkUser){
//             return res.status(404).json({
//                 messaage: `user not found`
//             })
//         }
//         const {categoryId}=req.params
//         const checkCategory=await categoryModel.findById(categoryId)
//         if(!checkCategory){
//             return res.status(404).json({
//                  messaage: `category  not found`
//             })
//         }
//         const {expense,amount,discription}=req.body
//         const getBalance=await ExpenseModel.findOne()
//         if(amount <= 0){
//             return res.status(404).json({
//                 messaage: `invalid amount.Amount must be postive value`
//             })
//         }
//         if(amount > balance){
//             return res.status(404).json({
//                 messaage: 'cannot add expense insufficient balance.please add income'
//             })
//         }
        
//         const expenseBalance=balance-amount
//         const expenseMade=new ExpenseModel({
//             expense,
//             amount,
//             discription,
//             userId:checkUser.userId
//         })
       
       
    
        
//     } catch (error) {
//         res.status(500).json({
//             message: 'An error occurred while processing your request.',
//             errorMessage:error.message})
        
//     }
//     }

exports.createExpense = async (req, res) => {  
    try {  
        const { userId } = req.user;  
        const checkUser = await userModel.findById(userId)
       
        //const checkUser = await userModel.findById(userId);  
        if (!checkUser) {  
            return res.status(404).json({  
                message: 'User not found'  
            });  
        }  
        
        
        const { categoryId } = req.params;  
        const checkCategory = await categoryModel.findById(categoryId);  
        if (!checkCategory) {  
            return res.status(404).json({  
                message: 'Category not found'  
            });  
        }  
        const { expense, amount, description } = req.body;  
       

        if (amount <= 0) {  
            return res.status(400).json({  
                message: 'Invalid amount. Amount must be a positive value'  
            });  
        }  
        if (amount > checkUser.availableBalance) {  
            return res.status(400).json({  
                message: 'Cannot add expense. Insufficient balance. Please add income'  
            });  
        }  

        const expenseBalance = Number(checkUser.availableBalance )- Number(amount)
        checkUser.availableBalance=expenseBalance
       const expenseTotal=Number(checkUser.totalExpenses) + Number(amount)
       checkUser.totalExpenses=expenseTotal
        const expenseMade = new ExpenseModel({  
            expense,  
            amount,  
            description,  
            Trackuser: checkUser._id,  
            category:categoryId
        }); 
        
       
       
        await expenseMade.save();  
        checkCategory.addExpense.push(expenseMade._id);  
        await checkCategory.save()
        checkUser.expenseTracker.push(expenseMade._id)
        await checkUser.save()
         
        res.status(201).json({  
            message: 'Expense added',  
            data: expenseMade  
        });  

    } catch (error) {  
        res.status(500).json({  
            message: 'An error occurred while processing your request.',  
            errorMessage: error.message  
        });  
    }  
};  

exports.expenseHistoryForAcategory = async (req, res) => {  
    try { 
        const { userId} = req.user;  
        const { categoryId } = req.params;  
        const expenses = await ExpenseModel.find({ category: categoryId,Trackuser:userId }).populate('category').sort({ createdAt: -1 });;  
        res.status(200).json({  
            message: 'Expense history retrieved successfully',  
            data: expenses  
        });  
    } catch (error) {  
        res.status(500).json({  
            message: 'An error occurred while fetching expense history.',  
            errorMessage: error.message  
        });  
    }  
};  


// exports.getTotalExpenseAmount = async (req, res) => {  
//     try {  
//         const { userId } = req.user; // Get the user ID from the request  
//         const expenses = await ExpenseModel.find({ userId }); // Find all expenses for the user  

//         // Calculate the total expense amount  
//         const totalExpense = expenses.totalExpenses;  

//         res.status(200).json({  
//             message: 'Total expense amount retrieved successfully',  
//             totalExpense  
//         });  
//     } catch (error) {  
//         res.status(500).json({  
//             message: 'An error occurred while fetching total expense amount.',  
//             errorMessage: error.message  
//         });  
//     }  
// };

exports.expenseHistory = async (req, res) => {  
    try {  
        const { userId} = req.user;  
        const expenses = await ExpenseModel.find({Trackuser:userId});  
        res.status(200).json({  
            message: 'Expense history retrieved successfully',  
            data: expenses  
        });  
    } catch (error) {  
        res.status(500).json({  
            message: 'An error occurred while fetching expense history.',  
            errorMessage: error.message  
        });  
    }  
};  
exports.deleteExpense=async(req,res)=>{
    try {
        const {expenseId}=req.params
        const expenseMade=await todoModel.findById(expenseId)
        if(!expenseMade){
         return res.status(404).json({
            message:'expense  not found'
         })
        }
        const deleteContent=await todoModel.findByIdAndDelete(expenseId)
        const {userId}=req.user
        const users=await userModel.findById(userId)
        users. expenseTracker.pop(expenseId)
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