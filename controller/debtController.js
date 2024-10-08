const debtModel=require('../model/loanModel');
const userModel=require('../model/userModel')
const targetModel=require('../model/target');
const { describe } = require('@hapi/joi/lib/base');
exports.createdebt=async(req,res)=>{
    try {
        const {userId}=req.user
        const{ description,debtOwed,duration}=req.body
        const checkUser=await userModel.findById(userId)
        if(!checkUser){
            return res.status(404).json({message:'user not found'})
        }
          const Totaldebt=Number(checkUser.totalDebtAmount) +Number(debtOwed)
          checkUser.totalDebtAmount=Totaldebt
          const Debt=new debtModel({
            description,
            debtOwed,
            duration,
            debtRemaining:debtOwed,
            Trackuser:userId

          })
          await Debt.save()
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
        
        const {debtId}=req.params
        const {amount}=req.body
        const date = new Date();  
const days = [  
  "Sunday",  
  "Monday",  
  "Tuesday",  
  "Wednesday",  
  "Thursday",  
  "Friday",  
  "Saturday",  
];  
const dayName = days[date.getUTCDay()];  
const localMonth = String(date.getMonth() + 1).padStart(2, '0'); // Zero-padded month  
const localYear = date.getFullYear();  

// Creating a more standard format  
const paidDateString = `${dayName} ${localMonth}/${localYear}`;  

// If you want to create a Date object for this specific date  
const paidDate = new Date(`${localYear}-${localMonth}-01T00:00:00Z`); // Example date, using the first of the month
        // const date = new Date();
        // const days = [
        //   "Sunday",
        //   "Monday",
        //   "Tuesday",
        //   "Wednesday",
        //   "Thursday",
        //   "Friday",
        //   "Saturday",
        // ];
        // const dayName = days[date.getUTCDay()];
        // const localMonth = date.getMonth() + 1; // Convert to 1-indexed
        // const localYear = date.getFullYear();
        // const paidDate = dayName + localMonth + "/" + localYear;
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
      
        if(findDebt.Trackuser.toString() !== userId.toString()){
            return res.status(401).json({
             message:'unable to update another users content'
            })
         }
       
         const acheiveGoal=Number(checkUser.totaldebtPaid)+Number(amount)
         checkUser.totaldebtPaid=acheiveGoal
         const categoryDebtRemaining=Number(findDebt.debtRemaining)-Number(amount)
         const debtRepaid=Number(findDebt.debtPaid)+Number(amount)
         if(debtRepaid >Number(findDebt.debtOwed)){
            return res.status(400).json({  
                message: `Error: The amount you are about to pay exceeds your debt owed, your balance to pay up your debt  is ${findDebt.debtRemaining}` 
            });
         }

         const percentagePaid=(debtRepaid)/(findDebt.debtOwed)*(100)
         const roundPercentage=Math.floor(percentagePaid)
         if (percentagePaid > 100) {  
            return res.status(400).json({  
                message: "Error: The percentage cannot exceed 100."  
            });  
        } 
     
         const debtData={
            date:paidDateString ,
            debtPaid:debtRepaid,
            amount,
            debtRemaining:categoryDebtRemaining,
            percentage: roundPercentage,
            }
     
          await targetModel.create({
            amount,
            date: paidDateString ,
            debts: debtId,
            paidDebt: debtRepaid,
            description:findDebt.description,
            Trackuser:userId,
             Type:"debt"
        });
     
    
    

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
        const budgetTargeted=await debtModel.findById(debtId)
        if(!budgetTargeted){
         return res.status(404).json({
            message:'debt not found'
         })
        }
        const deleteContent=await debtModel.findByIdAndDelete(debtId)
        const {userId}=req.user
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


