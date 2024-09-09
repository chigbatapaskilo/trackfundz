const router=require('express').Router();
const { signUp, verifyEmail, resendVerification,  login, makeAdmin, getOne, getAll, updateuserdetails } = require('../controller/userController');
const {forgetPassword, resetPassword, changePassword}=require('../controller/passwordController')
const { authorize, isAdmin } = require('../middleware/auth');
const { signUpValidation, forgetPasswordValidation, changePasswordValidation, loginvalidator, updateValidation } = require('../middleware/validation');
const upload=require('../utils/multer');

router.post('/signup',signUpValidation,signUp)
router.post('/login',loginvalidator,login)

router.get('/verification/:token',verifyEmail)
router.post('/reverify',resendVerification)
router.post('/forgetpassword',forgetPassword)
router.post('/verifyPassword/:passwordToken',forgetPasswordValidation,resetPassword)
router.post('/changePassword',changePasswordValidation,changePassword)
router.post('/makeadmin/:userId',makeAdmin)
router.get('/oneuser/:userId',getOne)
router.get('/alluseruserId/:',authorize,isAdmin,getAll)
router.put('/update/:userId',upload.single('profilePicture'),updateValidation,updateuserdetails)
module.exports=router
