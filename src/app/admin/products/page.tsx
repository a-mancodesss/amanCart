import React from 'react'
import PageHeader from '@/app/admin/_components/PageHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Table,TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const page = () => {
  return (
    <>
    <div className='flex justify-between items-center'>
        <PageHeader>Product</PageHeader>
        <Button asChild> 
            <Link href={'products/new/'}>Add Product</Link>
        </Button>
    </div>
    <ProductsTable />
    </>
  )
}
const ProductsTable = ()=>{
    return  (
      <>
      <Table>
        <TableHeader>
          <TableRow>
          <TableHead className="w-0">
              <span className="sr-only">Available For Purchase</span>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

        </TableBody>
      </Table>
      </>
    )
  }
export default page