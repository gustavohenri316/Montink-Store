"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  color: string
  colorName: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  isInWishlist: () => false,
  clearWishlist: () => {},
})

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedWishlist = localStorage.getItem("wishlist")
    if (storedWishlist) {
      try {
        const parsedWishlist = JSON.parse(storedWishlist)
        setItems(parsedWishlist)
      } catch (error) {
        console.error("Erro ao carregar a lista de desejos:", error)
        localStorage.removeItem("wishlist")
      }
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("wishlist", JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = (item: WishlistItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id && i.color === item.color)
      if (existingItemIndex > -1) {
        return prevItems
      } else {
        return [...prevItems, item]
      }
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id)
  }

  const clearWishlist = () => {
    setItems([])
  }
  
  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}
export const useWishlist = () => useContext(WishlistContext)
