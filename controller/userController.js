const sendMail=require('../helper/mail');
const {signUpTemplate,reSendverificationTemplate,forgetPasswordtemplate}=require('../helper/templates')
const bcrypt =require('bcrypt');
const Jwt=require('jsonwebtoken')
const userModel=require('../model/userModel')
const cloudinary=require('../config/cloudinary')
require('dotenv').config()


exports.signUp=async(req,res)=>{
    try {
       
        const {firstName,lastName,email,password,confirmPassword,phoneNumber}=req.body
        if(!firstName||!lastName||!email||!password||!phoneNumber||!confirmPassword){
            return res.status(400).json(
                { message: 'Please make sure all fields are filled out.' })
        }
        // Check if the passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                 message: 'The passwords you entered do not match. Please try again.' 
            });
        }
        const existingUser=await userModel.findOne({email:email.toLowerCase()})
        
        if(existingUser){
          return  res.status(400).json({
                message:` user with the email already exist`
            })
           
        }
        const saltPassword=await bcrypt.genSalt(10)
        const  hashPassword=await bcrypt.hash(password,saltPassword)
        const user=new userModel({
         firstName,
         lastName,
         email:email.toLowerCase(),
         phoneNumber,
         password:hashPassword,
         
        
        })

         const token=Jwt.sign({userId:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"1hr"})
         const verifyLink=`${req.protocol}://${req.get('host')}/api/v1/verification/${token}`
         
         const mailOption={
                email:user.email,
                subject:'verification of email',
                html:signUpTemplate(verifyLink,user.firstName)
         }
         await user.save()
         await sendMail(mailOption)
         res.status(201).json({
            message:`Welcome, ${user.firstName}! Please check your email and click the verification link to activate your account.`,
            data:user

         })
     } 
     
     catch (error){
        if (error.code === 11000) {
            const whatWentWrong = Object.keys(error.keyValue)[0];
            return res.status(500).json({ message: `A user with this ${whatWentWrong} already exists. Please use a different one.` });
          }else{
            res.status(500).json({
                message: 'An error occurred while processing your request.',
                errorMessage:error.message
            })
          }
     }}
    

exports.verifyEmail=async(req,res)=>{
    try {
        const {token}=req.params
        const {email}=Jwt.verify(token,process.env.JWT_SECRET)
    
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(404).json({ message: 'We could not find a user with this email address. Please make sure you’ve entered the correct one.' })
        }
        if(user.isVerified){
        return res.status(400).json({ message: 'Your email is already verified. No need to verify again.' })
        }
        user.isVerified=true
        user.save()
        res.status(200).json({ message: 'Your email has been successfully verified! You can now log in to your account.' })
        
    } catch (error) {
        if(error instanceof Jwt.JsonWebTokenError){
            return res.status(400).json(error.message)
            }
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message
        })
    }
}
exports.resendVerification=async(req,res)=>{
    try {
        const {email}=req.body
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(400).json({ message: 'We could not find a user with this email address. Please check and try again.' })
        }
        if(user.isVerified){
            return res.status(400).json({ message: 'Your email is already verified. No need to resend the verification link.' })
            }
        const token=Jwt.sign({userId:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:'1hr'})
        const verifyLink=`${req.protocol}://${req.get('host')}/api/v1/verification/${token}`
        const mailOption={
            email:user.email,
            subject:`reverification email`,
            html:reSendverificationTemplate(verifyLink,user.firstName)
        }
        await user.save()
        await sendMail(mailOption)
        res.status(200).json({ message: 'We have sent a new verification link to your email. Please check your inbox and follow the instructions to verify your email address.' })


    } catch (error) {
       
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message
        }) 
    }
}
exports.login=async(req,res)=>{
    try {
        const {email,password}=req.body
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(404).json({ message: 'We could not find an account with this email address. Please check and try again.' })
        }
        const comparePassword=await bcrypt.compare(password,user.password)
        if(!comparePassword){
            return res.status(400).json({ message: 'The password you entered is incorrect. Please try again.' })
        }
        if(!user.isVerified){
            return res.status(400).json({ message: 'Your account has not been verified yet. Please check your email and verify your account before logging in.' })
        }
        const token =Jwt.sign({userId:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"1hr"})
        res.status(200).json({
            message:`login successful`,
            data:user,
            token
        })
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message
        })
    }
}
exports.forgetPassword=async(req,res)=>{
    try {
        const {email}=req.body
        const user=await userModel.findOne({email})
        if(!user){
        return res.status(404).json('user not found')
        }
        const passwordToken=Jwt.sign({userId:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"10 mins"})
        const verificationLink=`${req.protocol}://${req.get('host')}/api/v1/verifyPassword/${passwordToken}`
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
        res.status(500).json(error.message)
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
exports.makeAdmin=async(req,res)=>{
try {
    const {userId}=req.params
    const user=await userModel.findById({userId})
    if(!user){
        return res.status(404).json('user not found.')
    }
    user.isAdmin=true
    await user.save()
    res.status(200).json('user now admin')
} catch (error) {
    res.status(500).json({
        message: 'An error occurred while processing your request.',
        errorMessage:error.message})
}
}