import { BrowserRouter, RouterProvider, useRoutes } from 'react-router-dom'
import RouterWaiter from './router/router'
import { RecoilRoot } from 'recoil'
import { Provider } from 'react-redux'
import store from './redux/store'

function App() {
  return (
    <RecoilRoot>
      <Provider store={store}>
        <BrowserRouter>
          <RouterWaiter />
        </BrowserRouter>
      </Provider>
    </RecoilRoot>
  )
}

export default App
