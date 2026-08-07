import {z} from "zod"
export const validateRequest = (schema)=>{
    return (req,res,next)=>{
        try{
            req.body = schema.parse(req.body)
            next()
        }
        catch(error){
            if (error instanceof z.ZodError){
                return res.status(400).json({
                    message: "Validatoin failed",
                    errors: error.errors.map((e)=>({
                        field: e.path.join("."),
                        message:e.message
                    }))
                })
            }
            return res.status(500).json({message:"Server error durin validation"})
        }
    }
}