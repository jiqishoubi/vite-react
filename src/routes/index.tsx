import { RouteObject } from 'react-router-dom'
import BasicLayout from '@/layouts/BasicLayout'
import Index from '@/pages/index'
import Index2 from '@/pages/index2'
import Page404 from '@/pages/common/404'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <BasicLayout />,
    children: [
      {
        path: 'index',
        element: <Index />,
      },
      {
        path: 'index2',
        element: <Index2 />,
      },
      { path: '*', element: <Page404 /> },
    ],
  },
  { path: '*', element: <Page404 /> },
]

export default routes
