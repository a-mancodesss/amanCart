"use server"
import {object, z} from 'zod'
const fileSchema  = z.instanceof(File, {message:"Required"})
const imageSchema = fileSchema.refine(file=>file.size ===0 || file.type.startsWith("image/"),{message:"Invalid Image"})
const addSchema = z.object({
    name: z.string().min(3),
    price: z.coerce.number().int().min(1),
    description: z.string(),
    file: fileSchema.refine(file=>file.size>0, {message:"Required"}), 
    image: imageSchema
})
export const addProduct = (formData: FormData) => {
    const res = addSchema.safeParse(Object.fromEntries(formData.entries()))
    if(res.error){
        return res.error.formErrors.fieldErrors;
    }
    
    console.log(formData)
}