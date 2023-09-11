import { Layout, ConfigProvider, Modal, Button, Avatar } from 'antd'
import React from 'react'

import Navbar from '@/components/Navbar/Navbar'

import { Outlet, useNavigate } from 'react-router-dom'
import { iconBaseUrl } from '@/api/baseConfig'
import { useRecoilValue } from 'recoil'
import { loginStatusState, userInfoState } from '@/recoil/store'

const Root: React.FC = () => {
  const { Header, Content, Footer } = Layout

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
          <Navbar></Navbar>
          <MyLogin></MyLogin>
        </Header>
        <Content
          id="mainContent"
          className="bg-white overflow-y-auto scroll-smooth"
        >
          <Outlet></Outlet>
        </Content>
        <Footer></Footer>
      </Layout>
    </ConfigProvider>
  )
}

export default Root

const MyLogin: React.FC = () => {
  const nav = useNavigate()
  const myInfo = useRecoilValue(userInfoState)
  const loginStatus = useRecoilValue(loginStatusState)

  const handleClick = async () => {
    loginStatus ? nav('/profile/info') : nav('/login')
  }

  return (
    <div
      className="bg-white h-full flex items-center"
      onClick={() => handleClick()}
    >
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
