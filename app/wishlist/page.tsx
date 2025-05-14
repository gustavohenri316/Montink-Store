"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import { formatCurrency } from "@/lib/utils"

export default function WishlistPage() {
  const { items, removeItem } = useWishlist()
  const { addItem } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      color: item.color,
      colorName: item.colorName,
      size: "40", 
      quantity: 1,
    })
  }

  if (!mounted) {
    return null 
  }

  return (
 <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Minha Lista de Desejos</h1>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a loja
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-10 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Sua lista de desejos está vazia</h3>
            <p className="text-sm text-muted-foreground">
              Adicione produtos à sua lista de desejos para encontrá-los facilmente mais tarde.
            </p>
          </div>
          <Button asChild>
            <Link href="/">Explorar produtos</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div key={`${item.id}-${item.color}`} className="group relative overflow-hidden rounded-lg border">
              <div className="aspect-square bg-white">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={300}
                  height={300}
                  className="h-full w-full object-contain p-4"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium">{item.name}</h3>
                <div className="mt-1 flex items-center">
                  <div
                    className="mr-2 h-4 w-4 rounded-full border"
                    style={{ backgroundColor: item.color }}
                    title={item.colorName}
                  ></div>
                  <span className="text-sm text-muted-foreground">{item.colorName}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-medium">{formatCurrency(item.price)}</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => removeItem(item.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remover
                    </Button>
                    <Button size="sm" onClick={() => handleAddToCart(item)}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Comprar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
