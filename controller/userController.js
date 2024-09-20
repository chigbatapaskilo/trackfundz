const sendMail=require('../helper/mail');
const {signUpTemplate,reSendverificationTemplate}=require('../helper/templates')
const bcrypt =require('bcrypt');
const Jwt=require('jsonwebtoken')
const userModel=require('../model/userModel')
const cloudinary=require('../config/cloudinary')
require('dotenv').config()
const fs=require('fs');



exports.signUp=async(req,res)=>{
    try {
       
        const {firstName,lastName,email,password,confirmPassword,phoneNumber, profilePicture}=req.body
        if(!firstName||!lastName||!email||!password||!phoneNumber||!confirmPassword ){
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
         profilePicture,
         password:hashPassword,
         
        
        })

         const token=Jwt.sign({userId:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"1hr"})
         const verifyLink=`https://trak-fundz.vercel.app/#/verifySuccessful/${token}`
         
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
    
        const user=await userModel.findOne({email:email.toLowerCase()})
        if(!user){
            return res.status(404).json({ message: 'We could not find a user with this email address. Please make sure you’ve entered the correct one.' })
        }
        if(user.isVerified){
        return res.status(400).json({ message: 'Your email is already verified. No need to verify again.' })
        }
        user.isVerified=true
        await user.save()
        res.status(200).json({ message: 'Your email has been successfully verified! You can now log in to your account.' })
        
    } catch (error) {
        if(error instanceof Jwt.JsonWebTokenError){
            return res.status(400).json({
                message:'link expired',
                errorMessage:error.message
            })
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
        const user=await userModel.findOne({email:email.toLowerCase()})
        if(!user){
            return res.status(400).json({ message: 'We could not find a user with this email address. Please check and try again.' })
        }
        if(user.isVerified){
            return res.status(400).json({ message: 'Your email is already verified. No need to resend the verification link.' })
            }
        const token=Jwt.sign({userId:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:'1hr'})
        const verifyLink=`https://trak-fundz.vercel.app/#/verifySuccessful/${token}`
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
        if(!email||!password){
            return res.status(400).json({message:'please enter email and password.'})   
        }
        const user=await userModel.findOne({email:email.toLowerCase()})
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
        const token =Jwt.sign({userId:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"2hr"})
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

exports.makeAdmin=async(req,res)=>{
try {
    const {userId}=req.params
    const user=await userModel.findById(userId)
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
exports.getOne=async(req,res)=>{
    try {
        const {userId}=req.params
        const user=await userModel.findById(userId)
        if(!user){
            return res.status(404).json({message:`user with the id:${userId} does not exist`})
        }
        res.status(200).json({message: `Welcome to Trakfundz, ${user.firstName}! You can track your loans, debt balances, and repayment schedules all in one place. Take control of your finances and start building a debt-free future today!`,  
        data: user  })
        
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message})
    }
}
exports.getAll=async(req,res)=>{
    try {
        const allUsers=await userModel.find()
        if(allUsers.length===0){
            return res.status(404).json({
                message: 'No registered users in the database.'
            })
        }
        res.status(200).json({message: 'Here are all the registered users in the database:',  
            data: allUsers })
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message})
    }
}
exports.updateuserdetails=async(req,res)=>{
    try {
        const {userId}=req.params
        const {phoneNumber,firstName,lastName}=req.body
        const user=await userModel.findById(userId)
        const file=req.file.path 
        if(!user){
            return res.status(404).json('user not found.')
        }
     
        const data={
            phoneNumber:phoneNumber||user.phoneNumber,
            firstName:firstName||user.firstName,
            lastName:lastName||user.lastName,
            
        }
        if (file) {
            // Upload new image to Cloudinary
            const image = await cloudinary.uploader.upload(file);
            
            // Delete previous image from Cloudinary
             // Check if there is an existing profilePicture and delete it from Cloudinary  
        if (user.profilePicture) {  
            await cloudinary.uploader.destroy(user.profilePicture);  

        } 
            // Update category image URL
            // user.profilePicture = image.secure_url;
            data.profilePicture=image.secure_url

            fs.unlink(file, (err) => {  
                if (err) {  
                    console.error(`Failed to delete local file: ${err}`);  
                } else {  
                    console.log(`Local file deleted: ${file}`);  
                }  
            });  
        
          }
       
         
        //  if (req.file) {
        //     const cloudProfile = await cloudinary.uploader.upload(req.file.path, { folder: "profilePicture" });
      
        //     data.profilePicture = {
        //       pictureUrl: cloudProfile.secure_url
        //     }
        //   } else {  
        //     return res.status(400).json('No file uploaded.');  
        // }  
       
        const updatedUser = await userModel.findByIdAndUpdate(userId,data,{new:true});
    res.status(200).json({
        message: "profile updated successfully",
        data:updatedUser
    })

    
        
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message})
    }
}