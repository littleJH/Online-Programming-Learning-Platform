import { RouterProvider } from 'react-router-dom'
import router from './router/router'
import { RecoilRoot } from 'recoil'
import { Provider } from 'react-redux'
import store from './redux/store'

function App() {
  return (
    <RecoilRoot>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </RecoilRoot>
  )
}

export default App
