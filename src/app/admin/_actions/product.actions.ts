"use server"
import {z} from 'zod'
import fs from 'fs/promises'
import db from '@/database/db'
import { redirect } from 'next/navigation'
import { File  } from 'buffer';

const fileSchema  = z.instanceof(File, {message:"Required"})
const imageSchema = fileSchema.refine(file=>file.size ===0 || file.type.startsWith("image/"),{message:"Invalid Image"})
const addSchema = z.object({
    name: z.string().min(3),
    priceInCents: z.coerce.number().int().min(1),
    description: z.string(),
    file: fileSchema.refine(file=>file.size>0, {message:"Required"}), 
    image: imageSchema
})
export const addProduct = async(prevState:unknown,formData: FormData) => {
    const res = addSchema.safeParse(Object.fromEntries(formData.entries()))
    if(res.error){
        // console.log(res.error.formErrors.fieldErrors)
        return res.error.formErrors.fieldErrors;
    }

    const data = res.data
    await fs.mkdir('products',{recursive:true})
    const filePath = `products/${crypto.randomUUID}-${data.file.name}`
    await fs.writeFile(filePath,Buffer.from(await data.file.arrayBuffer()))

    await fs.mkdir('public/products',{recursive:true})
    const imagePath = `/products/${crypto.randomUUID}-${data.image.name}`
    await fs.writeFile(`public${imagePath}`,Buffer.from(await data.image.arrayBuffer()))

    await db.product.create({
        data:{
            isAvailableForPurchase:false,
            name: data.name,
            priceInCents:data.priceInCents,
            description:data.description,
            filePath,
            imagePath
        }
    })
    redirect('/admin/products')
}