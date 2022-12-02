import { RouteObject } from 'react-router-dom'
import BasicLayout from '@/layouts/BasicLayout'
import Index from '@/pages/index'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <BasicLayout />,
    children: [
      {
        path: 'index',
        element: <Index />,
      },
    ],
  },
]

export default routes
