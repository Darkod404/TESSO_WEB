import { useEffect, useState } from 'react'
import { catalogApi } from '../services/catalogApi'
import type { ProductDto } from '../types/catalog'

export type MujerCatalogState =
  | { status: 'loading' }
  | { status: 'ok'; products: ProductDto[] }
  | { status: 'error'; message: string }

export function useMujerCatalog(): MujerCatalogState {
  const [state, setState] = useState<MujerCatalogState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function run() {
      setState({ status: 'loading' })
      try {
        const categories = await catalogApi.getCategories()
        const mujer = categories.find((c) => c.slug === 'mujer')
        if (!mujer) {
          if (!cancelled) setState({ status: 'ok', products: [] })
          return
        }
        const { items } = await catalogApi.getProducts({
          categoryId: mujer.id,
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
