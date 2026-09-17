import { http } from './http'

export type AuthResponse = {
  accessToken: string
  tokenType: string
  userId: string
  customerId: string
  email: string
  fullName: string
  role: string
}

export const authApi = {
  register: (body: {
    email: string
    password: string
    fullName: string
    phone?: string
  }) =>
    http.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    http.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
}
