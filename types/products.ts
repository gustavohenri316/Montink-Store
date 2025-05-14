interface ProductVariant {
  color: string
  colorName: string
  sizes: string[]
  images: ProductImage[]
}

interface ProductImage {
  id: number
  url: string
  alt: string
}

interface AddressData {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
}

