import { http } from './http'

export type CreateOrderPayload = {
  contactName: string
  contactEmail: string
  contactPhone: string
  shipDepartment: string
  shipCity: string
  shipStreet: string
  shipComplement?: string
  shipLat?: number
  shipLng?: number
  notes?: string
  items: { productId: string; variantId?: string; quantity: number }[]
}

export type OrderDto = {
  id: string
  orderNumber: string
  status: string
  contactName: string
  contactEmail: string
  contactPhone: string
  shipDepartment: string
  shipCity: string
  shipStreet: string
  shipComplement: string | null
  subtotal: number
  shipping: number
  total: number
  currency: string
  freeShipping: boolean
  createdAt: string
  items: {
    productId: string | null
    name: string
    imageUrl: string | null
    quantity: number
    unitPrice: number
    lineTotal: number
    currency: string
  }[]
}

export const orderApi = {
  create: (body: CreateOrderPayload) =>
    http.request<OrderDto>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  get: (id: string, email?: string) => {
    const q = email ? `?email=${encodeURIComponent(email)}` : ''
    return http.request<OrderDto>(`/api/orders/${id}${q}`)
  },

  mine: () => http.request<OrderDto[]>('/api/orders/me'),
}
