const planModel=require('../model/planModel')

exports.createPlan=async(req,res)=>{
    try {
        const {name,amount}=req.body
        const plan=new planModel({
            name,amount
        })
        await plan.save()
        res.status(201).json({
            message:`plan created successfully`,
            data:plan
        })
        
        
    } catch (error) {
        if(error.code==11000){
       const whatWentWrong=Object.keys(error.keyValue)[0]
       return res.status(500).json({ message: `this ${whatWentWrong} already exists. Please create a different one.` })
        }
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message
        })
    }
}