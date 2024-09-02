const joi = require('@hapi/joi');

exports.signUpValidation=async(req,res,next)=>{
    
    const signupvalidatorSChema=joi.object({
        firstName :joi.string().min(3).trim().required().pattern(/^\s*[A-Za-z]+\s*$/).messages({
            "any.required": "Please provide First name.",
            "string.empty": "First name cannot be left empty.",
            "string.min": "First name must be at least 3 characters long.",
            "string.pattern.base": "First name should only contain letters.",
        }),
        lastName:joi.string().min(3).trim().required().pattern(/^\s*[A-Za-z]+\s*$/).messages({
            "any.required": "Please provide last name.",
            "string.empty": "last name cannot be left empty.",
            "string.min": "last name must be at least 3 characters long.",
            "string.pattern.base": "last name should only contain letters.",
        }),
        email:joi.string().email().required().messages({
            "any.required": "Please provide an email.",
            "string.email": "Please provide a valid email address.",
        }),
        phoneNumber:joi.string().required().regex(/^\d{11}$/).message('Phone number must be exactly 11 digits',),
        password: joi.string()  
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/)  
        .min(8)  
        .max(20)  
        .required()  
        .messages({  
            'string.empty': 'Password cannot be empty.',  
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',  
            'string.min': 'Password must be at least 8 characters long.',  
            'string.max': 'Password must be at most 20 characters long.',  
            'any.required': 'Password is required.'  
        })  ,
        confirmPassword: joi.string()  
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/)  
        .min(8)  
        .max(20)  
        .required()  
        .messages({  
            'string.empty': 'confirm Password cannot be empty.',  
            'string.pattern.base': 'confirm Password must contain at least one uppercase letter, one lowercase letter, and one number.',  
            'string.min': 'confirm Password must be at least 8 characters long.',  
            'string.max': 'confirm Password must be at most 20 characters long.',  
            'any.required': 'confirm Password is required.'  
        })  ,
        
        })
        const {error}=signupvalidatorSChema.validate(req.body)
        if(error){
            return res.status(400).json({errorMessage:error.details[0].message})
        }
        next()
}
exports.loginvalidator=async(req,res,next)=>{
    const loginValidatorSchema=joi.object({
        email:joi.string().email().required().messages({
            "any.required": "Please provide an email.",
            "string.email": "Please provide a valid email address.",
        }),
        password: joi.string()  
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/)  
        .min(8)  
        .max(20)  
        .required()  
        .messages({  
            'string.empty': 'Password cannot be empty.',  
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',  
            'string.min': 'Password must be at least 8 characters long.',  
            'string.max': 'Password must be at most 20 characters long.',  
            'any.required': 'Password is required.'  
        })  
    })
    const {error}=loginValidatorSchema.validate(req.body)
    if(error){
        return res.status(400).json({errorMessage:error.details[0].message})
    }
    next()
}
exports.forgetPasswordValidation=async(req,res,next)=>{
    const forgetPasswordSchema=joi.object({
        password: joi.string()  
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/)  
        .min(8)  
        .max(20)  
        .required()  
        .messages({  
            'string.empty': 'Password cannot be empty.',  
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',  
            'string.min': 'Password must be at least 8 characters long.',  
            'string.max': 'Password must be at most 20 characters long.',  
            'any.required': 'Password is required.'  
        }) 
    })
    const {error}=forgetPasswordSchema.validate(req.body)
    if(error){
        return res.status(400).json({errorMessage:error.details[0].message})
    }
    next()
}
exports.changePasswordValidation=async(req,res,next)=>{
    const changePasswordSchema=joi.object({

        password: joi.string()  
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/)  
        .min(8)  
        .max(20)  
        .required()  
        .messages({  
            'string.empty': 'Password cannot be empty.',  
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',  
            'string.min': 'Password must be at least 8 characters long.',  
            'string.max': 'Password must be at most 20 characters long.',  
            'any.required': 'Password is required.'  
        }),
        existingPassword :joi.string()  
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/)  
        .min(8)  
        .max(20)  
        .required()  
        .messages({  
            'string.empty': 'Password cannot be empty.',  
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',  
            'string.min': 'Password must be at least 8 characters long.',  
            'string.max': 'Password must be at most 20 characters long.',  
            'any.required': 'Password is required.'  
        })

    })
    const {error}=changePasswordSchema.validate(req.body)
    if(error){
        return res.status(400).json({errorMessage:error.details[0].message})
    }
    next()  
}