import { useEffect, useState } from 'react'
import { catalogApi } from '../services/catalogApi'
import type { ProductDto } from '../types/catalog'

export type HombreCatalogState =
  | { status: 'loading' }
  | { status: 'ok'; products: ProductDto[] }
  | { status: 'error'; message: string }

export function useHombreCatalog(): HombreCatalogState {
  const [state, setState] = useState<HombreCatalogState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function run() {
      setState({ status: 'loading' })
      try {
        const categories = await catalogApi.getCategories()
        const hombre = categories.find((c) => c.slug === 'hombre')
        if (!hombre) {
          if (!cancelled) setState({ status: 'ok', products: [] })
          return
        }
        const { items } = await catalogApi.getProducts({
          categoryId: hombre.id,
          page: 1,
          pageSize: 48,
        })
        if (!cancelled) setState({ status: 'ok', products: items })
      } catch (e) {
        if (!cancelled) {
          const message = e instanceof Error ? e.message : 'Error desconocido'
          setState({ status: 'error', message })
        }
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
