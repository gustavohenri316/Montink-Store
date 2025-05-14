"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, ShoppingCart, Heart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { ConfirmationModal } from "./confirmation-modal";
import {
  productVariants,
  PRODUCT_ID,
  PRODUCT_NAME,
  PRODUCT_PRICE,
  whiteImages,
} from "@/constants/products";

export default function ProductPage() {
  const [mainImage, setMainImage] = useState<string>(
    productVariants[0].images[0].url
  );
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [cep, setCep] = useState<string>("");
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [isLoadingCep, setIsLoadingCep] = useState<boolean>(false);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [currentImages, setCurrentImages] =
    useState<ProductImage[]>(whiteImages);

  const [showCartModal, setShowCartModal] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);

  const { addItem: addToCart } = useCart();
  const {
    addItem: addToWishlist,
    isInWishlist,
    removeItem: removeFromWishlist,
  } = useWishlist();
  const { toast } = useToast();

  useEffect(() => {
    const savedData = localStorage.getItem("productSelections");

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        const timestamp = parsedData.timestamp || 0;
        const now = new Date().getTime();

        if (now - timestamp < 900000) {
          const colorExists = productVariants.find(
            (v) => v.color === parsedData.selectedColor
          );
          if (colorExists) {
            setSelectedColor(parsedData.selectedColor);
            setCurrentImages(colorExists.images);

            const imageExists = colorExists.images.find(
              (img) => img.url === parsedData.mainImage
            );
            setMainImage(
              imageExists ? parsedData.mainImage : colorExists.images[0].url
            );

            setAvailableSizes(colorExists.sizes);

            if (
              parsedData.selectedSize &&
              colorExists.sizes.includes(parsedData.selectedSize)
            ) {
              setSelectedSize(parsedData.selectedSize);
            }
          } else {
            setSelectedColor(productVariants[0].color);
            setCurrentImages(productVariants[0].images);
            setMainImage(productVariants[0].images[0].url);
            setAvailableSizes(productVariants[0].sizes);
          }

          setCep(parsedData.cep || "");
          setAddressData(parsedData.addressData || null);
        } else {
          localStorage.removeItem("productSelections");
        }
      } catch (error) {
        localStorage.removeItem("productSelections");
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      mainImage,
      selectedColor,
      selectedSize,
      cep,
      addressData,
      timestamp: new Date().getTime(),
    };

    localStorage.setItem("productSelections", JSON.stringify(dataToSave));
  }, [mainImage, selectedColor, selectedSize, cep, addressData]);

  useEffect(() => {
    if (selectedColor) {
      const variant = productVariants.find((v) => v.color === selectedColor);
      if (variant) {
        setAvailableSizes(variant.sizes);
        setCurrentImages(variant.images);
        setMainImage(variant.images[0].url);

        if (selectedSize && !variant.sizes.includes(selectedSize)) {
          setSelectedSize("");
        }
      }
    } else {
      setAvailableSizes([]);
    }
  }, [selectedColor]);

  const handleCepSearch = async () => {
    const cepClean = cep.replace(/\D/g, "");
    if (cepClean.length !== 8) {
      toast({
        title: "CEP inválido",
        description: "Por favor, digite um CEP válido com 8 dígitos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingCep(true);

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepClean}/json/`
      );
      const data = await response.json();

      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Não foi possível encontrar o endereço para este CEP.",
          variant: "destructive",
        });
        setAddressData(null);
      } else {
        setAddressData(data);
      }
    } catch (error) {
      toast({
        title: "Erro ao consultar CEP",
        description: "Ocorreu um erro ao consultar o CEP. Tente novamente.",
        variant: "destructive",
      });
      setAddressData(null);
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 5) {
      value = value.substring(0, 5) + "-" + value.substring(5, 8);
    }

    if (value.length <= 9) {
      setCep(value);
    }
  };

  const canAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast({
        title: "Selecione as opções",
        description:
          "Por favor, selecione cor e tamanho antes de adicionar ao carrinho.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const canAddToWishlist = () => {
    if (!selectedColor) {
      toast({
        title: "Selecione uma cor",
        description:
          "Por favor, selecione uma cor antes de adicionar à lista de desejos.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!canAddToCart()) return;
    setShowCartModal(true);
  };

  const confirmAddToCart = () => {
    const variant = productVariants.find((v) => v.color === selectedColor);
    if (!variant) return;

    addToCart({
      id: PRODUCT_ID,
      name: PRODUCT_NAME,
      price: PRODUCT_PRICE,
      image: variant.images[0].url,
      color: selectedColor,
      colorName: variant.colorName,
      size: selectedSize,
      quantity: 1,
    });

    toast({
      title: "Produto adicionado ao carrinho",
      description: `${PRODUCT_NAME} - ${variant.colorName}, Tamanho ${selectedSize}`,
      variant: "success",
    });
  };

  const handleWishlistToggle = () => {
    if (!canAddToWishlist()) return;

    const inWishlist = isInWishlist(PRODUCT_ID);
    setShowWishlistModal(true);
  };

  const confirmWishlistAction = () => {
    const variant = productVariants.find((v) => v.color === selectedColor);
    if (!variant) return;

    if (isInWishlist(PRODUCT_ID)) {
      removeFromWishlist(PRODUCT_ID);
      toast({
        title: "Produto removido da lista de desejos",
        description: `${PRODUCT_NAME} - ${variant.colorName}`,
        variant: "default",
      });
    } else {
      addToWishlist({
        id: PRODUCT_ID,
        name: PRODUCT_NAME,
        price: PRODUCT_PRICE,
        image: variant.images[0].url,
        color: selectedColor,
        colorName: variant.colorName,
      });
      toast({
        title: "Produto adicionado à lista de desejos",
        description: `${PRODUCT_NAME} - ${variant.colorName}`,
        variant: "success",
      });
    }
  };

  const getSelectedColorName = () => {
    return (
      productVariants.find((v) => v.color === selectedColor)?.colorName || ""
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ConfirmationModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        onConfirm={confirmAddToCart}
        type="cart"
        productName={PRODUCT_NAME}
        productColor={getSelectedColorName()}
        productSize={selectedSize}
      />

      <ConfirmationModal
        isOpen={showWishlistModal}
        onClose={() => setShowWishlistModal(false)}
        onConfirm={confirmWishlistAction}
        type={isInWishlist(PRODUCT_ID) ? "wishlist-remove" : "wishlist-add"}
        productName={PRODUCT_NAME}
        productColor={getSelectedColorName()}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white">
            <Image
              src={mainImage || "/placeholder.svg"}
              alt="Imagem principal do produto"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2 snap-x">
            {currentImages.map((image) => (
              <button
                key={image.id}
                onClick={() => setMainImage(image.url)}
                className={`relative w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0 snap-start ${
                  mainImage === image.url ? "border-primary" : "border-gray-200"
                } bg-white`}
              >
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Badge className="mb-2">Novo | 150+ vendidos</Badge>
            <h1 className="text-3xl font-bold">{PRODUCT_NAME}</h1>
            <div className="flex items-center mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-600">(128 avaliações)</span>
            </div>
          </div>

          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-primary">
              {formatCurrency(PRODUCT_PRICE)}
            </span>
            <span className="ml-2 text-sm text-gray-500 line-through">
              {formatCurrency(399.9)}
            </span>
            <span className="ml-2 text-sm text-green-600">25% OFF</span>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-3">Cor</h3>
            <div className="flex flex-wrap gap-3">
              {productVariants.map((variant) => (
                <button
                  key={variant.color}
                  onClick={() => setSelectedColor(variant.color)}
                  className={`relative w-12 h-12 rounded-full border-2 ${
                    selectedColor === variant.color
                      ? "border-primary"
                      : "border-gray-200"
                  }`}
                  style={{ backgroundColor: variant.color }}
                  title={variant.colorName}
                >
                  {selectedColor === variant.color && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check
                        className={`w-6 h-6 ${
                          variant.color === "#FFFFFF"
                            ? "text-black"
                            : "text-white"
                        }`}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
            {selectedColor && (
              <p className="mt-2 text-sm text-gray-600">
                Cor selecionada:{" "}
                {
                  productVariants.find((v) => v.color === selectedColor)
                    ?.colorName
                }
              </p>
            )}
          </div>

          {selectedColor && (
            <div>
              <h3 className="text-lg font-medium mb-3">Tamanho</h3>
              <RadioGroup
                value={selectedSize}
                onValueChange={setSelectedSize}
                className="flex flex-wrap gap-3"
              >
                {availableSizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Label
                      htmlFor={`size-${size}`}
                      className={`px-4 py-2 border rounded-md cursor-pointer ${
                        selectedSize === size
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-input hover:bg-muted"
                      }`}
                    >
                      <RadioGroupItem
                        value={size}
                        id={`size-${size}`}
                        className="sr-only"
                      />
                      {size}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-3">Calcular frete e prazo</h3>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Digite seu CEP"
                value={cep}
                onChange={handleCepChange}
                maxLength={9}
                className="max-w-[200px]"
              />
              <Button
                onClick={handleCepSearch}
                disabled={isLoadingCep || cep.replace(/\D/g, "").length !== 8}
              >
                {isLoadingCep ? "Consultando..." : "Consultar"}
              </Button>
              <a
                href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Não sei meu CEP
              </a>
            </div>

            {addressData && (
              <div className="mt-3 p-4 bg-muted rounded-md">
                <div className="flex items-start space-x-2">
                  <Truck className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Entrega para:</p>
                    <p>
                      {addressData.logradouro}, {addressData.bairro}
                    </p>
                    <p>
                      {addressData.localidade} - {addressData.uf},{" "}
                      {addressData.cep}
                    </p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span>Entrega padrão</span>
                        <span className="font-medium">R$ 19,90</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Entrega expressa</span>
                        <span className="font-medium">R$ 29,90</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              size="lg"
              
              disabled={!selectedColor || !selectedSize}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Adicionar ao carrinho
            </Button>
            <Button
              variant={isInWishlist(PRODUCT_ID) ? "default" : "outline"}
              size="lg"
              onClick={handleWishlistToggle}
            >
              <Heart
                className={`mr-2 h-5 w-5 ${
                  isInWishlist(PRODUCT_ID) ? "fill-current" : ""
                }`}
              />
              {isInWishlist(PRODUCT_ID)
                ? "Remover dos favoritos"
                : "Adicionar à lista de desejos"}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Descrição do produto</h2>
        <Separator className="mb-4" />
        <div className="prose max-w-none">
          <p>
            O Tênis Nike Court Vision Low Next Nature Masculino foi inspirado
            nos clássicos do basquete dos anos 80. Com materiais sustentáveis,
            este tênis combina o estilo retrô com a preocupação ambiental da
            linha Next Nature da Nike.
          </p>
          <p className="mt-4">Características principais:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Parte superior em couro sintético para maior durabilidade</li>
            <li>Solado em borracha que proporciona excelente tração</li>
            <li>Design clássico inspirado nos anos 80</li>
            <li>Entressola com amortecimento confortável</li>
            <li>
              Feito com pelo menos 20% de materiais reciclados (linha Next
              Nature)
            </li>
            <li>Perfil baixo para maior mobilidade</li>
            <li>Logo Swoosh nas laterais</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
