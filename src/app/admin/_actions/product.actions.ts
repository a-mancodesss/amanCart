"use server";
import { z } from "zod";
import fs from "fs/promises";
import db from "@/database/db";
import { notFound, redirect } from "next/navigation";
import { File } from "buffer";
import { revalidatePath } from "next/cache";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/"),
  { message: "Invalid Image" }
);
const addSchema = z.object({
  name: z.string().min(3),
  priceInCents: z.coerce.number().int().min(1),
  description: z.string(),
  file: fileSchema.refine((file) => file.size > 0, { message: "Required" }),
  image: imageSchema,
});
const editSchema = addSchema.extend({
    file: fileSchema.optional(),
    image: imageSchema.optional(),  
})
export const addProduct = async (prevState: unknown, formData: FormData) => {
  const res = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (res.error) {
    // console.log(res.error.formErrors.fieldErrors)
    return res.error.formErrors.fieldErrors;
  }

  const data = res.data;
 
  await fs.mkdir("products", { recursive: true })
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

  await fs.mkdir("public/products", { recursive: true })
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  )

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      priceInCents: data.priceInCents,
      description: data.description,
      filePath,
      imagePath,
    },
  });
  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
};
export async function updateProduct(
    id: string,
    prevState: unknown,
    formData: FormData
  ) {
    const result = editSchema.safeParse(Object.fromEntries(formData.entries()))
    if (result.success === false) {
      return result.error.formErrors.fieldErrors
    }
  
    const data = result.data
    const product = await db.product.findUnique({ where: { id } })
  
    if (product == null) return notFound()
  
    let filePath = product.filePath
    if (data.file != null && data.file.size > 0) {
      await fs.unlink(product.filePath)
      filePath = `products/${crypto.randomUUID()}-${data.file.name}`
      await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
    }
  
    let imagePath = product.imagePath
    if (data.image != null && data.image.size > 0) {
      await fs.unlink(`public${product.imagePath}`)
      imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
      await fs.writeFile(
        `public${imagePath}`,
        Buffer.from(await data.image.arrayBuffer())
      )
    }
  
    await db.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
        filePath,
        imagePath,
      },
    })
  
    revalidatePath("/")
    revalidatePath("/products")
  
    redirect("/admin/products")
  }
export const toggleProductAvailability = async (
  id: string,
  isAvailableForPurchase: boolean
) => {
  await db.product.update({
    where: { id },
    data: { isAvailableForPurchase },
  });
  revalidatePath("/");
  revalidatePath("/products");
};
export const deleteProduct = async (id: string) => {
  const product =await db.product.delete({
    where: { id },
  });
  if (product == null) return notFound();

  await fs.unlink(product.filePath)
  await fs.unlink(`public${product.imagePath}`)

  revalidatePath("/")
  revalidatePath("/products")
};
