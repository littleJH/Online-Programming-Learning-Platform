import { BrowserRouter } from 'react-router-dom'
import RouterWaiter from './router/router'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { ConfigProvider, notification, theme } from 'antd'
import { isDarkState, notificationApi, sideBarTypeState, themeState } from './store/appStore'
import { useEffect } from 'react'
import utils from './tool/myUtils/utils'
import './style.scss'

function App() {
  const myTheme = useRecoilValue(themeState)
  const setNotificationApi = useSetRecoilState(notificationApi)
  const setSideBarType = useSetRecoilState(sideBarTypeState)
  const [api, contextHolder] = notification.useNotification({
    placement: 'topRight',
    stack: false,
    maxCount: 3,
  })
  const isDark = useRecoilValue(isDarkState)

  useEffect(() => {
    setNotificationApi(api)
    setSideBarType(utils.getSideBarType(location.pathname))
  }, [])

  return (
    <ConfigProvider
      form={{
        validateMessages: {
          required: '"${label}"是必填字段',
        },
      }}
      avatar={{
        style: {
          border: '1px solid #ccc',
          opacity: '100%',
          cursor: 'pointer',
          transition: 'all',
          transitionDuration: '300ms',
        },
      }}
      theme={{
        token: {
          fontSize: 14,
          borderRadius: 4,
          wireframe: false,
          ...myTheme,
        },
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Menu: {},
        },
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
