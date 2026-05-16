import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { resolveCartProductSnapshot } from '../data/mockCatalog'
import type { ProductDto } from '../types/catalog'
import type { CartLineItem } from '../types/cart'

const STORAGE_KEY = 'tesso-cart-v1'

type CartContextValue = {
  items: CartLineItem[]
  /** Líneas con nombre/precio/imagen alineados al catálogo mock cuando aplica. */
  resolvedItems: CartLineItem[]
  /** Suma de unidades en todas las líneas (badge del carrito). */
  totalQuantity: number
  addItem: (product: ProductDto, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clear: () => void
  subtotal: number
  shipping: number
  total: number
  currency: string
}

const CartContext = createContext<CartContextValue | null>(null)

function loadItems(): CartLineItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (row): row is CartLineItem =>
        row &&
        typeof row === 'object' &&
        'product' in row &&
        'quantity' in row &&
        typeof (row as CartLineItem).quantity === 'number',
    )
  } catch {
    return []
  }
}

function snapshotFromProduct(product: ProductDto): CartLineItem['product'] {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    currency: product.currency,
    imageUrl: product.imageUrl,
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>(() =>
    typeof window === 'undefined' ? [] : loadItems(),
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product: ProductDto, quantity = 1) => {
    const q = Math.max(1, quantity)
    setItems((prev) => {
      const snap = snapshotFromProduct(product)
      const i = prev.findIndex((l) => l.product.id === snap.id)
      if (i === -1) return [...prev, { product: snap, quantity: q }]
      const next = [...prev]
      next[i] = { ...next[i], quantity: next[i].quantity + q }
      return next
    })
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const q = Math.floor(quantity)
    if (q < 1) {
      setItems((prev) => prev.filter((l) => l.product.id !== productId))
      return
    }
    setItems((prev) =>
      prev.map((l) => (l.product.id === productId ? { ...l, quantity: q } : l)),
    )
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((l) => l.product.id !== productId))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const resolvedItems = useMemo(
    () =>
      items.map((line) => ({
        ...line,
        product: resolveCartProductSnapshot(line.product),
      })),
    [items],
  )

  const totalQuantity = useMemo(
    () => items.reduce((n, line) => n + line.quantity, 0),
    [items],
  )

  const { subtotal, shipping, total, currency } = useMemo(() => {
    const sub = resolvedItems.reduce((s, l) => s + l.product.price * l.quantity, 0)
    const curr = resolvedItems[0]?.product.currency ?? 'MXN'
    const ship = sub === 0 || sub >= 1500 ? 0 : 99
    return { subtotal: sub, shipping: ship, total: sub + ship, currency: curr }
  }, [resolvedItems])

  const value = useMemo(
    () => ({
      items,
      resolvedItems,
      totalQuantity,
      addItem,
      setQuantity,
      removeItem,
      clear,
      subtotal,
      shipping,
      total,
      currency,
    }),
    [
      items,
      resolvedItems,
      totalQuantity,
      addItem,
      setQuantity,
      removeItem,
      clear,
      subtotal,
      shipping,
      total,
      currency,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
