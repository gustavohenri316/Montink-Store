"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Heart, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";

export function Header() {
  const { items: cartItems, setIsOpen: openCart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openCart(true);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold tracking-tight">
                Montink Store
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6 flex-1 justify-end">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar produtos..."
                className="w-full pl-9 focus-visible:ring-1"
              />
            </div>

            <Button variant="ghost" size="icon" asChild className="relative ">
              <Link href="/wishlist">
                <Heart className="h-7 w-7" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs font-medium text-primary-foreground flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
                <span className="sr-only">Lista de desejos</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-7 w-7" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs font-medium text-primary-foreground flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
              <span className="sr-only">Carrinho</span>
            </Button>
          </div>

          <div className="flex items-center md:hidden gap-2">
            <Button variant="ghost" size="icon" onClick={toggleSearch}>
              <Search className="h-7 w-7" />
            </Button>

            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/wishlist">
                <Heart className="h-7 w-7" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs font-medium text-primary-foreground flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-7 w-7" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs font-medium text-primary-foreground flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Button>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar produtos..."
                className="w-full pl-9"
              />
            </div>
          </div>
        )}

        {mobileMenuOpen && (
          <div className="pb-4 md:hidden">
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="px-4 py-2 text-sm font-medium">
                Início
              </Link>
              <Link href="/products" className="px-4 py-2 text-sm font-medium">
                Produtos
              </Link>
              <Link
                href="/categories"
                className="px-4 py-2 text-sm font-medium"
              >
                Categorias
              </Link>
              <Link href="/about" className="px-4 py-2 text-sm font-medium">
                Sobre nós
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
