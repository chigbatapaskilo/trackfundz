const userModel=require('../model/userModel')

const IncomeModel=require('../model/incomeModel')

exports.createIncome = async (req, res) => {  
    try {  
        const {userId}=req.user
        const checkUser=await userModel.findById(userId)
        if(!checkUser){
            return res.status(404).json({
                message:'user not found'
            })
        }
        
        const { income, paymentName } = req.body;  
        if (!income || !paymentName) {  
            return res.status(400).json({  
                message: 'All fields are required'  
            });  
        }  
        
        if (income <= 0) {  
            return res.status(400).json({  
                message: 'Invalid income amount. Amount must be a positive value'  
            });  
        }  
        const credit=Number(checkUser.availableBalance) +Number (income)
        checkUser.availableBalance=credit
        console.log(credit)
        const addIncome = new IncomeModel({  
            income,  
            paymentName,  
        //    Trackuser:userId
        }); 
        
        await addIncome.save();  
        checkUser.userIncome.push(addIncome._id)
        await checkUser.save()

        
        res.status(201).json({  
            message: 'Income added',  
            data: addIncome  
        });  

    } catch (error) {  
        res.status(500).json({  
            message: 'An error occurred while processing your request.',  
            errorMessage: error.message  
        });  
    }  
};  
exports.IncomeHistory=async(req,res)=>{
    try {
       const {userId }=req.user
       const income=await IncomeModel.find({Trackuser:userId }).sort({ createdAt: -1 })
       res.status(200).json({
        message:'users income',
        data:income
       })
        
    } catch (error) {
        res.status(500).json({  
            message: 'An error occurred while processing your request.',  
            errorMessage: error.message  
        })  
    }
}