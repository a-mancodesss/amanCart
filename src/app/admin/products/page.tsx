import React from "react";
import PageHeader from "@/app/admin/_components/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/database/db";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ActiveToggleDropdownItem, DeleteDropdownItem } from "./_components/ProductActions";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";

const page = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <PageHeader>Product</PageHeader>
        <Button asChild>
          <Link href={"products/new/"}>Add Product</Link>
        </Button>
      </div>
      <ProductsTable />
    </>
  );
};
const ProductsTable = async () => {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      _count: { select: { orders: true } },
    },
    orderBy: {
      name: 'asc'
    }
  });
  return (
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
          {products.map(product => (
            <TableRow key={product.id}>
              <TableCell>
                {product.isAvailableForPurchase ?
                  <>
                    <span className="sr-only">Available For Purchase</span>
                    <CheckCircle2 />
                  </> :
                  <>
                    <span className="sr-only">Not Available For Purchase</span>
                    <XCircle />
                  </>
                }
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{formatCurrency(product.priceInCents / 100)}</TableCell>
              <TableCell>{formatNumber(product._count.orders)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>

                    <MoreVertical />
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <a download href={`products/${product.id}/download`}>Download</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                  <Link href={`products/${product.id}/edit/`}>Edit</Link>
                    </DropdownMenuItem>
                    <ActiveToggleDropdownItem id={product.id} isAvailableForPurchase={product.isAvailableForPurchase}/>
                    <DropdownMenuSeparator/>
                    <DeleteDropdownItem id={product.id} disabled={product._count.orders > 0 } />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
export default page;
