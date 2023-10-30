import { Layout, ConfigProvider, Modal, Button, Avatar } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import Navbar from '@/components/navbar/Navbar'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Outlet, useNavigate } from 'react-router-dom'
import { iconBaseUrl } from '@/api/baseConfig'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  loginStatusState,
  sideBarCollapsed,
  userInfoState
} from '@/store/appStore'
import Sider from 'antd/es/layout/Sider'
import SideBar from '@/components/navbar/SideBar'
import { headerNavState } from '@/store/appStore'
import useNavTo from '@/tool/myHooks/useNavTo'

const Root: React.FC = () => {
  const [collapsed, setCollapsed] = useRecoilState(sideBarCollapsed)
  const [btnCollapsed, setBtnCollapsed] = useState(false)
  const headerNav = useRecoilValue(headerNavState)
  const { Header, Content, Footer } = Layout

  useEffect(() => {
    setCollapsed(btnCollapsed)
  }, [btnCollapsed])

  const siderStyle: React.CSSProperties = {
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#3ba0e9'
  }

  const footerStyle: React.CSSProperties = {
    padding: '0'
  }

  return (
    <ConfigProvider
      form={{
        validateMessages: {
          required: '"${label}"是必选字段'
        }
      }}
      theme={{
        token: {
          colorPrimary: '#6366f1',
          colorSuccess: '#10b981',
          colorWarning: '#f59e0b',
          colorError: '#ef4444',
          colorInfo: '#3b82f6',
          fontSize: 14,
          borderRadius: 4,
          wireframe: false
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
    >
      <Layout className="w-full h-full">
        <Header className="sticky top-0 z-10 p-0 flex">
          <Navbar headerNav={headerNav}></Navbar>
          <MyLogin></MyLogin>
        </Header>
        <Layout hasSider>
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
          <Content
            id="mainContent"
            className="bg-white overflow-y-auto scroll-smooth px-16 py-8 flex justify-center"
          >
            <Outlet></Outlet>
          </Content>
        </Layout>

        <Footer style={footerStyle}>
          <Button
            type="text"
            icon={btnCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setBtnCollapsed(!btnCollapsed)}
          />
        </Footer>
      </Layout>
    </ConfigProvider>
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
    <div className="bg-white h-full flex items-center" onClick={handleClick}>
      {loginStatus && (
        <Avatar
          className="hover:cursor-pointer mr-8"
          alt="登录"
          src={`${iconBaseUrl}/${myInfo?.icon}`}
        ></Avatar>
      )}
      {!loginStatus && <Button type="link">登录</Button>}
    </div>
  )
}
