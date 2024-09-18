const joi=require('@hapi/joi')

exports.debtValidation=async(req,res,next)=>{
    const debtValidationSchema=joi.object({
        debtOwed:joi.number()  
        .greater(0)  
        .required()  
        .messages({   
            'number.base': 'Amount must be a number.',  
            'number.greater': 'Amount must be greater than zero.', 
            "number.empty": "target cannot be left empty.", 
            'any.required': 'Amount is required.'  
        }),
        duration: joi.string().regex(/^\d+ (weeks|days|months)$/).required().messages({
            'string.pattern.base': 'Duration must be in the format "number weeks/days/months"'
          }),
          description:joi.string().min(2).required().messages({
            'string.min': 'Description must be at least 2 characters long.',
            "string.empty": "Description cannot be left empty.",
            'any.required': 'Description is required.', 
        
          })
    })
    const {error}=debtValidationSchema.validate(req.body)
    if(error){
        return res.status(400).json({errorMessage:error.details[0].message})
    }
    next()
}
