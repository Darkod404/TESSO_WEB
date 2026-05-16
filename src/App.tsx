import { RouterProvider } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { router } from './app/router'

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  )
}
