/**
 * Catálogo ficticio temporal — eliminar o desactivar cuando el backend esté conectado.
 * Opción: poner `USE_TEMPORARY_MOCK_CATALOG` en false y borrar este archivo si ya no aplica.
 */
import type { CategoryDto, PagedResult, ProductDto } from '../types/catalog'
import type { CartProductSnapshot } from '../types/cart'

export const USE_TEMPORARY_MOCK_CATALOG = true

const CAT_HOMBRE_ID = '10000000-0000-4000-8000-000000000001'
const CAT_MUJER_ID = '10000000-0000-4000-8000-000000000002'

export const MOCK_CATEGORIES: CategoryDto[] = [
  {
    id: CAT_HOMBRE_ID,
    name: 'Hombre',
    slug: 'hombre',
    description: 'Camisetas y piezas para hombre',
    imageUrl: null,
    productCount: 6,
  },
  {
    id: CAT_MUJER_ID,
    name: 'Mujer',
    slug: 'mujer',
    description: 'Camisetas y piezas para mujer',
    imageUrl: null,
    productCount: 6,
  },
]

const img = {
  tee1: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  tee2: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80',
  tee3: 'https://images.unsplash.com/photo-1562157873-818bc6b6f08a?auto=format&fit=crop&w=900&q=80',
  tee4: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80',
  tee5: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  tee6: 'https://images.unsplash.com/photo-1509631179647-017733b3a051?auto=format&fit=crop&w=900&q=80',
}

export const MOCK_PRODUCTS: ProductDto[] = [
  {
    id: '20000000-0000-4000-8000-000000000001',
    name: 'Camiseta Negra Essentials',
    slug: 'camiseta-negra-essentials',
    description: 'Corte clásico, algodón peinado.',
    price: 449,
    currency: 'MXN',
    imageUrl: img.tee1,
    isFeatured: true,
    stock: 40,
    categoryId: CAT_HOMBRE_ID,
    categoryName: 'Hombre',
    categorySlug: 'hombre',
  },
  {
    id: '20000000-0000-4000-8000-000000000002',
    name: 'Playera Gris Urban',
    slug: 'playera-gris-urban',
    description: 'Estampado mínimo, tono gris perla.',
    price: 399,
    currency: 'MXN',
    imageUrl: img.tee2,
    isFeatured: true,
    stock: 32,
    categoryId: CAT_HOMBRE_ID,
    categoryName: 'Hombre',
    categorySlug: 'hombre',
  },
  {
    id: '20000000-0000-4000-8000-000000000003',
    name: 'Oversize Burdeos',
    slug: 'oversize-burdeos',
    description: 'Volumen actual, color vino.',
    price: 529,
    currency: 'MXN',
    imageUrl: img.tee3,
    isFeatured: false,
    stock: 18,
    categoryId: CAT_HOMBRE_ID,
    categoryName: 'Hombre',
    categorySlug: 'hombre',
  },
  {
    id: '20000000-0000-4000-8000-000000000004',
    name: 'Tank Performance',
    slug: 'tank-performance',
    description: 'Tejido ligero para entrenar.',
    price: 349,
    currency: 'MXN',
    imageUrl: img.tee4,
    isFeatured: true,
    stock: 25,
    categoryId: CAT_HOMBRE_ID,
    categoryName: 'Hombre',
    categorySlug: 'hombre',
  },
  {
    id: '20000000-0000-4000-8000-000000000005',
    name: 'Camiseta Blanca Base',
    slug: 'camiseta-blanca-base',
    description: 'Para estampar o usar limpia.',
    price: 329,
    currency: 'MXN',
    imageUrl: img.tee2,
    isFeatured: false,
    stock: 50,
    categoryId: CAT_HOMBRE_ID,
    categoryName: 'Hombre',
    categorySlug: 'hombre',
  },
  {
    id: '20000000-0000-4000-8000-000000000006',
    name: 'Long Sleeve Carbón',
    slug: 'long-sleeve-carbon',
    description: 'Manga larga, tono carbón.',
    price: 579,
    currency: 'MXN',
    imageUrl: img.tee1,
    isFeatured: false,
    stock: 15,
    categoryId: CAT_HOMBRE_ID,
    categoryName: 'Hombre',
    categorySlug: 'hombre',
  },
  {
    id: '20000000-0000-4000-8000-000000000011',
    name: 'Camiseta Crop Arena',
    slug: 'camiseta-crop-arena',
    description: 'Largo crop, tono arena.',
    price: 419,
    currency: 'MXN',
    imageUrl: img.tee5,
    isFeatured: true,
    stock: 28,
    categoryId: CAT_MUJER_ID,
    categoryName: 'Mujer',
    categorySlug: 'mujer',
  },
  {
    id: '20000000-0000-4000-8000-000000000012',
    name: 'Playera Rosa Empolvado',
    slug: 'playera-rosa-empolvado',
    description: 'Corte regular, tacto suave.',
    price: 389,
    currency: 'MXN',
    imageUrl: img.tee6,
    isFeatured: true,
    stock: 22,
    categoryId: CAT_MUJER_ID,
    categoryName: 'Mujer',
    categorySlug: 'mujer',
  },
  {
    id: '20000000-0000-4000-8000-000000000013',
    name: 'Oversize Mujer Marfil',
    slug: 'oversize-mujer-marfil',
    description: 'Silueta amplia, marfil.',
    price: 499,
    currency: 'MXN',
    imageUrl: img.tee5,
    isFeatured: false,
    stock: 20,
    categoryId: CAT_MUJER_ID,
    categoryName: 'Mujer',
    categorySlug: 'mujer',
  },
  {
    id: '20000000-0000-4000-8000-000000000014',
    name: 'Muscle Tee Carbón',
    slug: 'muscle-tee-carbon',
    description: 'Tirantes anchos, carbón.',
    price: 359,
    currency: 'MXN',
    imageUrl: img.tee6,
    isFeatured: false,
    stock: 30,
    categoryId: CAT_MUJER_ID,
    categoryName: 'Mujer',
    categorySlug: 'mujer',
  },
  {
    id: '20000000-0000-4000-8000-000000000015',
    name: 'Camiseta Negra Slim',
    slug: 'camiseta-negra-slim',
    description: 'Corte entallado.',
    price: 429,
    currency: 'MXN',
    imageUrl: img.tee5,
    isFeatured: true,
    stock: 35,
    categoryId: CAT_MUJER_ID,
    categoryName: 'Mujer',
    categorySlug: 'mujer',
  },
  {
    id: '20000000-0000-4000-8000-000000000016',
    name: 'Pack 2 Básicas',
    slug: 'pack-2-basicas',
    description: 'Dos playeras combinables.',
    price: 699,
    currency: 'MXN',
    imageUrl: img.tee6,
    isFeatured: false,
    stock: 12,
    categoryId: CAT_MUJER_ID,
    categoryName: 'Mujer',
    categorySlug: 'mujer',
  },
]

export function getMockProductById(id: string): ProductDto | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id)
}

/** En carrito: alinear líneas con el catálogo mock mientras dure el modo temporal. */
export function resolveCartProductSnapshot(stored: CartProductSnapshot): CartProductSnapshot {
  if (!USE_TEMPORARY_MOCK_CATALOG) return stored
  const live = getMockProductById(stored.id)
  if (!live) return stored
  return {
    id: live.id,
    name: live.name,
    slug: live.slug,
    price: live.price,
    currency: live.currency,
    imageUrl: live.imageUrl,
  }
}

function mockDelay(ms = 60) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

export const mockCatalogApi = {
  async getCategories(): Promise<CategoryDto[]> {
    await mockDelay()
    return MOCK_CATEGORIES
  },

  async getFeaturedProducts(take = 8): Promise<ProductDto[]> {
    await mockDelay()
    const featured = MOCK_PRODUCTS.filter((p) => p.isFeatured)
    return featured.slice(0, take)
  },

  async getProducts(params: {
    categoryId?: string
    page?: number
    pageSize?: number
  }): Promise<PagedResult<ProductDto>> {
    await mockDelay()
    let list = [...MOCK_PRODUCTS]
    if (params.categoryId) {
      list = list.filter((p) => p.categoryId === params.categoryId)
    }
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 12
    const start = (page - 1) * pageSize
    const items = list.slice(start, start + pageSize)
    return {
      items,
      total: list.length,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(list.length / pageSize)),
    }
  },
}
