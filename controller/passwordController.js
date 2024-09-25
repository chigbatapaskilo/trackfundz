const userModel=require('../model/userModel')
const sendMail=require('../helper/mail');
const {forgetPasswordtemplate}=require('../helper/templates')
const Jwt=require("jsonwebtoken")
const bcrypt =require('bcrypt');
require('dotenv').config()

exports.forgetPassword=async(req,res)=>{
    try {
        const {email}=req.body
        const user=await userModel.findOne({email})
        if(!user){
        return res.status(404).json('user not found')
        }
        const passwordToken=Jwt.sign({userId:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"10 mins"})
        const verificationLink=`https://trak-fundz.vercel.app/#/reset/${passwordToken}`
        const mailOption={
            email:user.email,
            subject:`forgetten password`,
            html:forgetPasswordtemplate(verificationLink,user.firstName)
        }
        await sendMail(mailOption)
        res.status(200).json('check your email to confirm and reset password')
        
    } catch (error) {
        if(error instanceof Jwt.JsonWebTokenError){
            return res.status(error.message)
        }
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message})
    }
}
exports.resetPassword=async(req,res)=>{
    try {
        const {passwordToken}=req.params
        const {password}=req.body
        const {email}=Jwt.verify(passwordToken,process.env.JWT_SECRET)
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(404).json('user not found')
        }
        const saltPassword=await bcrypt.genSalt(10)
        const hashPassword=await bcrypt.hash(password,saltPassword)
        user.password=hashPassword
        await user.save()
        res.status(200).json('password successfully changed')
    } catch (error) {
       res.status(500).json({
        message: 'An error occurred while processing your request.',
        errorMessage:error.message})
    }
}
exports.changePassword = async (req, res) => {
    try {
        const { token } = req.params
        const { password, existingPassword } = req.body;

       
        const { email } = Jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        
        const isPasswordMatch = await bcrypt.compare(existingPassword,user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Existing password does not match.",
            })
        }
        if(password===existingPassword){
         return res.status(401).json({
            message:'your new password must be diffirent from existing password'
         })
        }

    
        const saltedRound = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltedRound);

    
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: "Password changed successful",
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            message: error.message,
        })
    }
};