import { useEffect, useState } from 'react'
import { catalogApi } from '../services/catalogApi'
import type { CategoryDto, ProductDto } from '../types/catalog'

type State =
  | { status: 'loading' }
  | { status: 'ok'; categories: CategoryDto[]; featured: ProductDto[] }
  | { status: 'error'; message: string }

export function useCatalogHome(): State {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function run() {
      setState({ status: 'loading' })
      try {
        const [categories, featured] = await Promise.all([
          catalogApi.getCategories(),
          catalogApi.getFeaturedProducts(8),
        ])
        if (!cancelled) {
          setState({ status: 'ok', categories, featured })
        }
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
