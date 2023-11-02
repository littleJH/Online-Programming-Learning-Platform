import React, { useEffect, useState } from 'react'
import { Layout, Button, Avatar, theme } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Outlet } from 'react-router-dom'
import { iconBaseUrl } from '@/config/apiConfig'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { isDarkState, loginStatusState, sideBarCollapsed, themeState, userInfoState } from '@/store/appStore'
import Sider from 'antd/es/layout/Sider'
import SideBar from '@/components/Navbar/SideBar'
import Navbar from '@/components/Navbar/Navbar'
import { headerNavState } from '@/store/appStore'
import useNavTo from '@/tool/myHooks/useNavTo'
import MySvgIcon from '@/components/Icon/MySvgIcon'

const Root: React.FC = () => {
  const [collapsed, setCollapsed] = useRecoilState(sideBarCollapsed)
  const [btnCollapsed, setBtnCollapsed] = useState(!collapsed)
  const headerNav = useRecoilValue(headerNavState)
  const { Header, Content, Footer } = Layout
  const { token } = theme.useToken()
  const [isDark, setIsDark] = useRecoilState(isDarkState)

  useEffect(() => {
    setCollapsed(btnCollapsed)
  }, [btnCollapsed])

  useEffect(() => console.log('headerNav ==> ', headerNav), [headerNav])

  const siderStyle: React.CSSProperties = {
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#3ba0e9'
  }

  const footerStyle: React.CSSProperties = {
    padding: '0'
  }

  return (
    <Layout className='w-full h-full'>
      <Header
        className='sticky top-0 z-10 p-0 flex items-center'
        style={{ backgroundColor: token.colorBgBase }}
      >
        <Navbar headerNav={headerNav}></Navbar>
        <Button
          type='text'
          className='flex items-center h-12'
          onClick={() => setIsDark((value) => !value)}
        >
          <MySvgIcon
            href={`#icon-${isDark ? 'light' : 'dark'}`}
            size={2}
          ></MySvgIcon>
        </Button>
        <Button
          type='text'
          className='flex items-center h-12'
        >
          <MyLogin></MyLogin>
        </Button>
      </Header>
      <Layout hasSider>
        {!['login', 'problemdetail'].includes(headerNav) && (
          <Sider
            onMouseOver={() => setCollapsed(false)}
            onMouseLeave={() => setCollapsed(btnCollapsed)}
            style={siderStyle}
            collapsible
            trigger={null}
            collapsed={collapsed}
          >
            <SideBar header={headerNav}></SideBar>
          </Sider>
        )}
        <Content
          id='mainContent'
          className='bg-white py-4'
          style={{
            backgroundColor: token.colorBgBlur
          }}
        >
          <div className='w-full h-full flex justify-center overflow-y-scroll scroll-smooth'>
            <Outlet></Outlet>
          </div>
        </Content>
      </Layout>

      <Footer style={footerStyle}>
        <Button
          type='text'
          icon={btnCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setBtnCollapsed(!btnCollapsed)}
        />
      </Footer>
    </Layout>
  )
}

export default Root

const MyLogin: React.FC = () => {
  const nav = useNavTo()
  const myInfo = useRecoilValue(userInfoState)
  const loginStatus = useRecoilValue(loginStatusState)
  const setSideBarCollapsed = useSetRecoilState(sideBarCollapsed)

  const handleClick = () => {
    nav('/profile')
    setSideBarCollapsed(true)
  }

  return (
    <div
      className='h-full flex items-center'
      onClick={handleClick}
    >
      {loginStatus && (
        <Avatar
          className='hover:cursor-pointer'
          alt='登录'
          src={`${iconBaseUrl}/${myInfo?.icon}`}
        ></Avatar>
      )}
      {!loginStatus && <Button type='link'>登录</Button>}
    </div>
  )
}
