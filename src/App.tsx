import { RouterProvider } from 'react-router-dom'
import router from './router/router'
import { RecoilRoot, useSetRecoilState } from 'recoil'

function App() {
  return (
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  )
}

export default App
