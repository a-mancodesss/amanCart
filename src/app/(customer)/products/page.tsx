import { ProductCard, ProductCardSkeleton } from '@/components/ProductCards'
import db from '@/database/db'
import React, { Suspense } from 'react'

const getProducts =  () => {
    return db.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy:{name:'asc'}
    })
}
const page = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense />
        </Suspense>
      </div>
  )
}

export default page

const ProductSuspense = async()=>{
    const products =  await getProducts()
    return products.map((product)=>(<ProductCard key={product.id} {...product}/>))
}