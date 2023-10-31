import { BrowserRouter } from 'react-router-dom'
import RouterWaiter from './router/router'
import { useRecoilValue } from 'recoil'
import { ConfigProvider } from 'antd'
import { themeState } from './store/appStore'
import { useEffect } from 'react'
import './style.scss'

function App() {
  const theme = useRecoilValue(themeState)

  useEffect(() => {
    const globalStyle = document.getElementsByTagName('body')[0].style
    for (let key in theme) {
      if (theme[key]) {
        globalStyle.setProperty(`--${key}`, theme[key])
      }
    }
  }, [])

  return (
    <ConfigProvider
      form={{
        validateMessages: {
          required: '"${label}"是必选字段'
        }
      }}
      avatar={{
        style: {
          border: '1px solid #ccc',
          opacity: '100%',
          cursor: 'pointer',
          transition: 'all',
          transitionDuration: '300ms'
        }
      }}
      theme={{
        token: {
          fontSize: 14,
          borderRadius: 4,
          wireframe: false,
          ...theme
        }
      }}
    >
      <BrowserRouter>
        <RouterWaiter />
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
