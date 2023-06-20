import { RouterProvider, Routes } from 'react-router-dom'
import router from './router/router'
import { Provider } from 'react-redux'
import store from '@/app/store'

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App
