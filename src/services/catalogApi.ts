import type { CategoryDto, PagedResult, ProductDto } from '../types/catalog'
import { getApiBaseUrl } from './apiBase'

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status} ${res.statusText}${text ? `: ${text}` : ''}`)
  }
  return (await res.json()) as T
}

export const catalogApi = {
  getCategories: () => getJson<CategoryDto[]>('/api/Catalog/categories'),
  getFeaturedProducts: (take = 8) =>
    getJson<ProductDto[]>(`/api/Catalog/products/featured?take=${take}`),
  getProducts: (params: { categoryId?: string; page?: number; pageSize?: number }) => {
    const q = new URLSearchParams()
    if (params.categoryId) q.set('categoryId', params.categoryId)
    if (params.page) q.set('page', String(params.page))
    if (params.pageSize) q.set('pageSize', String(params.pageSize))
    const qs = q.toString()
    return getJson<PagedResult<ProductDto>>(`/api/Catalog/products${qs ? `?${qs}` : ''}`)
  },
}
