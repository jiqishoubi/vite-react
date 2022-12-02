import './App.less'
import { useRoutes, BrowserRouter } from 'react-router-dom'
import routes from '@/routes'

function RouterView() {
  let element = useRoutes(routes)
  return element
}

function App() {
  return (
    <BrowserRouter>
      <RouterView />
    </BrowserRouter>
  )
}

export default App
