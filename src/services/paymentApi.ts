import { http } from './http'

export type PaymentIntent = {
  paymentId: string
  orderId: string
  orderNumber: string
  amount: number
  currency: string
  wompiPublicKey: string | null
  reference: string
  wompiBaseUrl: string
}

export const paymentApi = {
  createIntent: (orderId: string) =>
    http.request<PaymentIntent>(`/api/payments/orders/${orderId}/intent`, {
      method: 'POST',
    }),
}
