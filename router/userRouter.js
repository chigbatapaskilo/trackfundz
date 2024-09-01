const router=require('express').Router();
const { signUp, verifyEmail, resendVerification, forgetPassword, resetPassword, changePassword, login, makeAdmin } = require('../controller/userController');
const { signUpValidation, forgetPasswordValidation, changePasswordValidation, loginvalidator } = require('../middleware/validation');
const upload=require('../utils/multer');

router.post('/signup',signUpValidation,signUp)
router.post('/login',loginvalidator,login)

router.get('/verification/:token',verifyEmail)
router.post('/reverify',resendVerification)
router.post('/forgetpassword',forgetPassword)
router.post('/verifyPassword/:passwordToken',forgetPasswordValidation,resetPassword)
router.post('/changePassword',changePasswordValidation,changePassword)
router.post('/makeadmin/:userId',makeAdmin)
module.exports=router
//upload.single('profilePicture')
