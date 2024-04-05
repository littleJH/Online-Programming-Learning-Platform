import { BrowserRouter, HashRouter } from 'react-router-dom'
import RouterWaiter from './router/router'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { ConfigProvider, message, notification, theme } from 'antd'
import { isDarkState, isMobileAtom, notificationApi, sideBarTypeState, themeState } from './store/appStore'
import { useEffect } from 'react'
import utils from './tool/myUtils/utils'
import './style.scss'

function App() {
  const isMobile = useRecoilValue(isMobileAtom)
  const myTheme = useRecoilValue(themeState)
  const setNotificationApi = useSetRecoilState(notificationApi)
  const setIsMobile = useSetRecoilState(isMobileAtom)
  const [api, contextHolder] = notification.useNotification({
    placement: isMobile ? 'bottom' : 'topRight',
    stack: false,
    maxCount: isMobile ? 1 : 3,
    duration: isMobile ? 1 : 3,
  })
  const [isDark, setIsDark] = useRecoilState(isDarkState)

  useEffect(() => {
    setNotificationApi(api)
    const themeMedia = window.matchMedia('(prefers-color-scheme: dark)')
    themeMedia.addEventListener('change', handleThemeChange)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('change', handleThemeChange)
    }
  }, [])

  const handleResize = (e: any) => {
    // console.log('handle window resize ==> ', e)
    const isSmallScreen = e?.target?.innerWidth <= 768
    setIsMobile(isSmallScreen)
  }

  const handleThemeChange = (e: any) => {
    setIsDark(e.matches)
    localStorage.setItem('isDark', e.matches)
  }

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
      <BrowserRouter basename="/">
        <RouterWaiter />
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
