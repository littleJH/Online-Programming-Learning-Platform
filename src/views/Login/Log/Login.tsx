import React, { useState } from 'react'
import { LockOutlined, UserOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Space, notification } from 'antd'
import '../Log/log.scss'
import { NavLink, useNavigate } from 'react-router-dom'
import { getCurrentUserinfo, loginApi } from '@/api/user'
import { useSetRecoilState } from 'recoil'
import { userInfoState } from '@/store/appStore'
import FindPass from './FindPass'

const App: React.FC<{
  setmode: Function
}> = props => {
  const setUserInfo = useSetRecoilState(userInfoState)
  const [openFindpassModal, setOpenFindpassModal] = useState(false)

  const onFinish = (values: any) => {
    const form = new FormData()
    form.append('Email', values.Email)
    form.append('Password', values.Password)
    loginApi(form)
      .then(res => {
        if (res.data.code === 200) {
          console.log(res)
          const token = res.data.data.token
          localStorage.setItem('token', token)
          notification.success({
            message: '欢迎',
            placement: 'topRight',
            duration: 1
          })
          window.history.back()
          return Promise.resolve()
        } else {
          notification.error({
            message: res.data.msg
          })
        }
      })
      .then(() => {
        getCurrentUserinfo().then(res => {
          console.log(res.data)
          setUserInfo(res.data.data.user)
        })
      })
      .catch(err => {
        notification.error({
          message: '登录失败',
          description: ''
        })
      })
  }

  return (
    <div className="w-full h-full  flex justify-start items-center">
      <div className="">
        <div className="text-end my-4">
          <Button
            type="link"
            icon={<RightOutlined />}
            onClick={() => props.setmode('Register')}
          >
            注册
          </Button>
        </div>
        <Form
          style={{ width: '28rem' }}
          name="normal_login"
          onFinish={onFinish}
        >
          <Form.Item
            name="Email"
            rules={[
              {
                type: 'email',
                message: '邮箱格式错误'
              }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="邮箱" />
          </Form.Item>
          <Form.Item
            name="Password"
            rules={[
              {
                required: true,
                message: '请输入密码'
              }
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="Password"
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item>
            <Button type="link" onClick={() => setOpenFindpassModal(true)}>
              忘记密码
            </Button>
          </Form.Item>
          <Form.Item className="text-center">
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
      <FindPass
        openFindPwModal={openFindpassModal}
        setOpenFindPwModal={setOpenFindpassModal}
      ></FindPass>
    </div>
  )
}

export default App
