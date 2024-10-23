import PageHeader from "@/app/admin/_components/PageHeader"
import { ProductForm } from "../../_components/PageHeader"
import db from "@/database/db"


const page = async({params:{id}}:{params:{id:string}}) => {
    const product = await db.product.findUnique({where:{id}})
  return (
    <>
    <PageHeader> Update Product</PageHeader>
    <ProductForm product={product}/>
    </>
  )
}

export default page