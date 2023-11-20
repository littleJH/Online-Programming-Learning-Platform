import { BrowserRouter } from 'react-router-dom'
import RouterWaiter from './router/router'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { ConfigProvider, notification, theme } from 'antd'
import { isDarkState, notificationApi, themeState } from './store/appStore'
import { useEffect } from 'react'
import './style.scss'

function App() {
  const myTheme = useRecoilValue(themeState)
  const setNotificationApi = useSetRecoilState(notificationApi)
  const [api, contextHolder] = notification.useNotification({
    placement: 'bottomRight',
    stack: false,
    maxCount: 6
  })
  const isDark = useRecoilValue(isDarkState)

  useEffect(() => {
    setNotificationApi(api)
  }, [])

  return (
    <ConfigProvider
      form={{
        validateMessages: {
          required: '"${label}"是必填字段'
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
          ...myTheme
        },
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Menu: {}
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
