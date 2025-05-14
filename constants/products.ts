export const whiteImages: ProductImage[] = [
  { id: 1, url: "/images/tenis-1.png", alt: "Tênis Nike Court Vision Low - branco vista frontal" },
  { id: 2, url: "/images/tenis-2.png", alt: "Tênis Nike Court Vision Low - branco vista lateral" },
  { id: 3, url: "/images/tenis-3.png", alt: "Tênis Nike Court Vision Low - branco vista traseira" },
  { id: 4, url: "/images/tenis-4.png", alt: "Tênis Nike Court Vision Low - branco vista superior" },
  { id: 5, url: "/images/tenis-6.png", alt: "Tênis Nike Court Vision Low - branco detalhe da sola" },
]

export const blackImages: ProductImage[] = [
  { id: 1, url: "/images/tenis-preto-1.png", alt: "Tênis Nike Court Vision Low - preto vista frontal" },
  { id: 2, url: "/images/tenis-preto-2.png", alt: "Tênis Nike Court Vision Low - preto vista lateral" },
  { id: 3, url: "/images/tenis-preto-3.png", alt: "Tênis Nike Court Vision Low - preto vista traseira" },
]

 const orangeImages: ProductImage[] = [
  { id: 1, url: "/images/tenis-laranja-1.png", alt: "Tênis Nike Court Vision Low - laranja vista frontal" },
  { id: 2, url: "/images/tenis-laranja-2.png", alt: "Tênis Nike Court Vision Low - laranja vista lateral" },
]

 const greenImages: ProductImage[] = [
  { id: 1, url: "/images/tenis-verde-1.png", alt: "Tênis Nike Court Vision Low - verde vista frontal" },
]

export const productVariants: ProductVariant[] = [
  { color: "#FFFFFF", colorName: "Branco", sizes: ["38", "39", "40", "41", "42", "43"], images: whiteImages },
  { color: "#000000", colorName: "Preto", sizes: ["38", "39", "40", "41", "42"], images: blackImages },
  { color: "#f54500", colorName: "Laranja Royal", sizes: ["39", "40", "41", "42"], images: orangeImages },
  { color: "#1f4618", colorName: "Verde", sizes: ["38", "40", "41", "43"], images: greenImages },
]

export const PRODUCT_ID = "nike-court-vision-low"
export const PRODUCT_NAME = "Tênis Nike Court Vision Low Next Nature Masculino"
export const PRODUCT_PRICE = 299.9