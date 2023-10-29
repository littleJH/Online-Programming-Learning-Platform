import { BrowserRouter } from 'react-router-dom'
import RouterWaiter from './router/router'
import { RecoilRoot } from 'recoil'

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <RouterWaiter />
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default App
