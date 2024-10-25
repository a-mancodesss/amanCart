import db from "@/database/db"

export async function pageaa({params:{id}}:{params:{id:string}}) {
    const product = await db.product.findUnique({where:{id}})
  return (
    <div>purchase successful!</div>
  )
}

