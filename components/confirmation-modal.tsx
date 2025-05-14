"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ShoppingCart, Heart } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  type: "cart" | "wishlist-add" | "wishlist-remove"
  productName: string
  productColor: string
  productSize?: string
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  productName,
  productColor,
  productSize,
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            {type === "cart" ? (
              <>
                <ShoppingCart className="mr-2 h-5 w-5 text-primary" />
                Adicionar ao Carrinho
              </>
            ) : (
              <>
                <Heart className="mr-2 h-5 w-5 text-primary" />
                {type === "wishlist-add" ? "Adicionar aos Favoritos" : "Remover dos Favoritos"}
              </>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {type === "cart" ? (
              <>
                Você está adicionando <strong>{productName}</strong> na cor <strong>{productColor}</strong>
                {productSize && (
                  <>
                    , tamanho <strong>{productSize}</strong>
                  </>
                )}{" "}
                ao seu carrinho.
              </>
            ) : (
              <>
                Você está {type === "wishlist-add" ? "adicionando" : "removendo"} <strong>{productName}</strong> na cor{" "}
                <strong>{productColor}</strong> {type === "wishlist-add" ? "à" : "da"} sua lista de favoritos.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {type === "cart"
              ? "Adicionar ao Carrinho"
              : type === "wishlist-add"
                ? "Adicionar aos Favoritos"
                : "Remover dos Favoritos"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
