const categorys=require("../model/categoryModel")
const userModel=require("../model/userModel")

exports.createCategory=async(req,res)=>{
    try {
     
        const {name}=req.body
        if(!name){
            return res.status(400).json({
                message:'category name is required'
            })
        }
        
        const newCategory=new categorys({
            name
        })
        await newCategory.save()
        res.status(201).json({
            message:'new category created',
            newCategory
        })
       
    
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message
        }) 
    }
}
 exports.getCategory=async(req,res)=>{
    try {
        const { categoryId } = req.params;

        const categoryName= await categorys.findById(categoryId)

        if (!categoryName) {
            return res.status(404).json({
                message: `category does not exist`,
            });
        }

        res.status(200).json({
            
            data: categoryName,
        });
        
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message
        })
    }
 }
 exports.allCategorys=async(req,res)=>{
    try {
        const findCategorys=await categorys.find()
        if(findCategorys.length ===0){
         return res.status(404).json({
            message:'no category found'
         })
        }
        res.status(200).json({
            message:'here are all the categorys',
            data:findCategorys
        })
        
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message
        })  
    }
 }
 exports.deletecategory=async(req,res)=>{
    try {
        const {categoryId}=req.params
        const findCategory=await categorys.findById(categoryId)
        if(!findCategory){
            return res.status(404).json({
                message:`category not found`
            })
        }
        const deleteAcategory=await categorys.findByIdAndDelete(categoryId)
        res.status(200).json({
            message:'deleted successfully'
        })

    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while processing your request.',
            errorMessage:error.message
        })  
    }
 }