import { BrowserRouter } from 'react-router-dom'
import RouterWaiter from './router/router'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { ConfigProvider, notification } from 'antd'
import { notificationApi, themeState } from './store/appStore'
import { useEffect } from 'react'
import './style.scss'

function App() {
  const theme = useRecoilValue(themeState)
  const setNotificationApi = useSetRecoilState(notificationApi)
  const [api, contextHolder] = notification.useNotification()

  useEffect(() => {
    setNotificationApi(api)
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
      {contextHolder}
      <BrowserRouter>
        <RouterWaiter />
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
