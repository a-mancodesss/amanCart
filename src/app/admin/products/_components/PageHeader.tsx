"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/formatter"
import {  useState } from "react"
import { addProduct } from "../../_actions/product.actions"
import { useFormState, useFormStatus } from "react-dom"
const SubmitButton = ()=>{
  const {pending}= useFormStatus()
  return(
    <Button type="submit" disabled={pending}>
      {pending?'Saving...':'Save'}
    </Button>
  )
}
export const ProductForm = () => {
  const [error, formAction] = useFormState(addProduct, {})
  const [priceInCents, setPriceInCents] = useState<number | undefined>()
  return (
    <form action={formAction} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" name="name" id="name" required/>
        {error.name && <div className="text-red-500">{error.name}</div>}
      </div>
      <div className="space-y-2">

      <Label htmlFor="priceInCents">Price In Cents</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          value={priceInCents||''}
          onChange={e => setPriceInCents(Number(e.target.value) || undefined)}
          />
        {error.priceInCents && <div className="text-red-500">{error.priceInCents}</div>}

          </div>
          <div className="text-muted-foreground">
          {formatCurrency((priceInCents || 0) / 100)}
        </div>
        <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea name="description" id="description" required/>
        {error.description && <div className="text-red-500">{error.description}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" name="file" id="file" required/>
        {error.file && <div className="text-red-500">{error.file}</div>}

      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" name="image" id="image" required/>
        {error.image && <div className="text-red-500">{error.image}</div>}

      </div>
      <SubmitButton/>
    </form>
  )
}
