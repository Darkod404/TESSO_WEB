import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { StoreSettingsProvider } from './context/StoreSettingsContext'
import { router } from './app/router'

export default function App() {
  return (
    <AuthProvider>
      <StoreSettingsProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </StoreSettingsProvider>
    </AuthProvider>
  )
}
