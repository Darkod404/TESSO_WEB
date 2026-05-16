import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '../components/layout/MainLayout'
import { FaqPage } from '../pages/FaqPage'
import { HomePage } from '../pages/HomePage'
import { HombrePage } from '../pages/HombrePage'
import { MujerPage } from '../pages/MujerPage'
import { OrdenesEspecialesPage } from '../pages/OrdenesEspecialesPage'
import { PersonalizaPage } from '../pages/PersonalizaPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'hombre', element: <HombrePage /> },
      { path: 'mujer', element: <MujerPage /> },
      { path: 'ordenes-especiales', element: <OrdenesEspecialesPage /> },
      { path: 'personaliza', element: <PersonalizaPage /> },
      { path: 'preguntas-frecuentes', element: <FaqPage /> },
    ],
  },
])
