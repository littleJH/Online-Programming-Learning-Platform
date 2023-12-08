import React, { useEffect, useState, useLayoutEffect, useMemo } from 'react'
import { Layout, Button, Avatar, theme } from 'antd'
import { Outlet } from 'react-router-dom'
import { iconBaseUrl } from '@/config/apiConfig'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  isDarkState,
  loginStatusState,
  pathNameState,
  sideBarTypeState,
  userInfoState,
} from '@/store/appStore'
import Sider from 'antd/es/layout/Sider'
import SideBar from '@/components/Navbar/SideBar'
import Navbar from '@/components/Navbar/Navbar'
import { headerNavState } from '@/store/appStore'
import useNavTo from '@/tool/myHooks/useNavTo'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import { footerRightNode } from '@/store/footerStore'
import { getPathArray } from '@/tool/MyUtils/Utils'
import Directory from '@/components/directory/Directory'

const Root: React.FC = () => {
  // const [collapsed, setCollapsed] = useRecoilState(sideBarCollapsed)
  // const [btnCollapsed, setBtnCollapsed] = useState(collapsed)
  const headerNav = useRecoilValue(headerNavState)
  const { Header, Content, Footer } = Layout
  const { token } = theme.useToken()
  const [isDark, setIsDark] = useRecoilState(isDarkState)
  const footerRight = useRecoilValue(footerRightNode)
  const pathname = useRecoilValue(pathNameState)
  const sideBarType = useRecoilValue(sideBarTypeState)
  const myInfo = useRecoilValue(userInfoState)
  const loginStatus = useRecoilValue(loginStatusState)
  const nav = useNavTo()

  useLayoutEffect(() => {
    if (pathname === '' || pathname === '/') nav('/home')
  }, [])

  useEffect(() => console.log('headerNav ==> ', headerNav), [headerNav])

  useEffect(() => {
    const body = document.getElementsByTagName('body')[0]
    body.style.setProperty('--colorBgBase', token.colorBgBase)
    body.style.setProperty('--colorTextBase', token.colorTextBase)
    body.style.setProperty('--colorBgBlur', token.colorBgBlur)
  }, [token])

  const sidebarWidth = useMemo(() => {
    let width = 0
    if (sideBarType === 'directory') width = 300
    if (sideBarType === 'nav') width = 200
    return width
  }, [sideBarType])

  const showPaddingY = React.useMemo(
    () =>
      !['problemdetail', 'competitiondetail'].includes(
        getPathArray(pathname)[0],
      ),
    [pathname],
  )
  const full = React.useMemo(() => pathname === '/creation/article', [pathname])

  const headerStyle: React.CSSProperties = {
    backgroundColor: `${isDark ? '#141414' : '#ffffff'}`,
    boxShadow: token.boxShadowTertiary,
  }

  const siderStyle: React.CSSProperties = {
    color: token.colorTextBase,
    backgroundColor: token.colorBgBase,
    transition: 'all 500',
  }

  const footerStyle: React.CSSProperties = {
    padding: '0',
  }

  return (
    <Layout className="w-full h-full">
      <Header
        className="sticky top-0 z-10 p-0 flex items-center"
        style={headerStyle}
      >
        <Navbar headerNav={headerNav}></Navbar>

        <Button
          type="text"
          className="flex items-center h-12 p-2"
          onClick={() => setIsDark(value => !value)}
        >
          <MySvgIcon
            href={`#icon-${isDark ? 'light' : 'dark'}`}
            size={2}
            color={`${isDark ? '#fff' : '#000'}`}
          ></MySvgIcon>
        </Button>
        {myInfo?.level && myInfo?.level >= 4 && (
          <Button
            type="text"
            className="flex items-center h-12 p-2"
            onClick={() => nav('/file')}
          >
            <MySvgIcon
              href="#icon-folder"
              size={2}
              color={token.colorWarning}
            ></MySvgIcon>
          </Button>
        )}
        <Button type="text" className="flex items-center h-12 p-2 mr-4">
          <div
            className="h-full flex items-center"
            onClick={() => nav('/profile')}
          >
            {loginStatus && (
              <Avatar
                className="hover:cursor-pointer"
                alt="登录"
                src={`${iconBaseUrl}/${myInfo?.icon}`}
              ></Avatar>
            )}
            {!loginStatus && <Button type="link">登录</Button>}
          </div>
        </Button>
      </Header>
      <Layout hasSider>
        {!['login', 'problemdetail'].includes(headerNav) && (
          <Sider
            // onMouseOver={() => setCollapsed(false)}
            // onMouseLeave={() => setCollapsed(btnCollapsed)}
            style={siderStyle}
            collapsible
            trigger={null}
            // collapsed={collapsed}
            width={sidebarWidth}
          >
            {sideBarType === 'nav' && <SideBar header={headerNav}></SideBar>}
            {sideBarType === 'directory' && <Directory></Directory>}
          </Sider>
        )}
        <Content
          style={{
            backgroundColor: token.colorBgBlur,
          }}
        >
          <div
            id="content"
            className="w-full h-full overflow-y-scroll scroll-smooth"
            style={{
              padding: `${showPaddingY ? '1rem 0' : '0'}`,
              position: 'relative',
            }}
          >
            <div
              className="h-full"
              style={{ width: full ? '100%' : 'min-content', margin: 'auto' }}
            >
              <Outlet></Outlet>
            </div>
          </div>
        </Content>
      </Layout>

      <Footer style={footerStyle}>
        {/* left */}
        <div
          className="w-1/2"
          style={{
            display: 'inline-block',
            minHeight: '2rem',
          }}
        >
          {/* <Button
            type='text'
            icon={btnCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => {
              setCollapsed(!btnCollapsed)
              setBtnCollapsed(!btnCollapsed)
            }}
          /> */}
        </div>
        {/* right */}
        <div
          className="w-1/2 flex items-center"
          style={{
            display: 'inline-block',
          }}
        >
          {footerRight}
        </div>
      </Footer>
    </Layout>
  )
}

export default Root
