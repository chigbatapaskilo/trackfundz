const subscriptionModel=require('../model/subscriptionModel')
const userModel=require('../model/userModel')

const planModel=require('../model/planModel')

exports.SubscribeToAPlan=async(req,res)=>{
    try {
        const {userId}=req.user
        const {planId}=req.params
        const checkUser=await userModel.findById(userId)
        if(!checkUser){
           res.status(404).json({
            message:'user not found'
           })
        }
        const checkPlan=await planModel.findById(planId)
        if(!checkPlan){
            res.status(404).json({
                message:'plan not found'
               }) 
        }
        const Subscribe=new subscriptionModel({
        Status:"active",
        Trackuser:userId,
        plans:planId
        })
        await Subscribe.save()
        res.status(200).json({
            message:'sucription successful',
            data:Subscribe
        })

    
        
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message
        }) 
    }
}