import { Layout, ConfigProvider, Modal } from 'antd'
import React, { Fragment, useState } from 'react'

import Navbar from '@/components/Navbar/Navbar'
import Login from '@/components/Log/Login'
import Register from '@/components/Log/Register'
import { Outlet } from 'react-router-dom'

const Root: React.FC = () => {
  const { Header, Content, Footer } = Layout

  return (
    <ConfigProvider
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
    >
      <Layout className="w-full h-full">
        <Header className="sticky top-0 z-10 p-0 flex">
          <Navbar></Navbar>
          <MyLogin></MyLogin>
        </Header>
        <Content className="p-0 bg-white">
          <Outlet></Outlet>
        </Content>
        <Footer></Footer>
      </Layout>
    </ConfigProvider>
  )
}

export default Root

const MyLogin: React.FC = () => {
  const [openModal, setOpenModal] = useState(false)
  const [mode, setmode] = useState<'login' | 'register'>('login')

  const handleClick = async () => {
    setOpenModal(true)
  }

  return (
    <Fragment>
      <div className="bg-white h-full flex items-center">
        <div className="avatar-small bg-gray-300" onClick={() => handleClick()}>
          {}
        </div>
      </div>
      <Modal
        title="Log"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={[]}
      >
        {mode === 'login' && (
          <Login setOpenModal={setOpenModal} setmode={setmode}></Login>
        )}
        {mode === 'register' && (
          <Register setOpenModal={setOpenModal} setmode={setmode}></Register>
        )}
      </Modal>
    </Fragment>
  )
}
