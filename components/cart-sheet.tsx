"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";

export function CartSheet() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    subtotal,
    totalItems,
  } = useCart();
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleCartToggle = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-cart-toggle]")) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("click", handleCartToggle);
    return () => document.removeEventListener("click", handleCartToggle);
  }, [setIsOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg" ref={sheetRef}>
        <SheetHeader className="px-1">
          <SheetTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Carrinho ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 py-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">Seu carrinho está vazio</h3>
              <p className="text-sm text-muted-foreground">
                Adicione produtos ao seu carrinho para continuar comprando.
              </p>
            </div>
            <Button onClick={() => setIsOpen(false)}>
              Continuar comprando
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.color}-${item.size}`}
                    className="flex items-start gap-4"
                  >
                    <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-white">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>
                          Cor: {item.colorName}, Tamanho: {item.size}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Diminuir quantidade</span>
                          </Button>
                          <span className="w-5 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Aumentar quantidade</span>
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </span>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground"
                            onClick={() =>
                              removeItem(item.id, item.color, item.size)
                            }
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remover item</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Separator />
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Frete</span>
                  <span>Calculado no checkout</span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              </div>
              <div className="flex items-center rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <AlertCircle className="mr-2 h-4 w-4" />
                <p>O frete será calculado na página de pagamento.</p>
              </div>
              <SheetFooter className="flex-col gap-2 sm:flex-col">
                <Button asChild className="w-full">
                  <Link href="/checkout">Finalizar compra</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                >
                  Continuar comprando
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
