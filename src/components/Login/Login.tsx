import React, { useState } from 'react'
import { LockOutlined, UserOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Space } from 'antd'
import './log.scss'
import { getCurrentUserinfo, loginApi } from '@/api/user'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { notificationApi, userInfoState } from '@/store/appStore'
import FindPass from './FindPass'
import style from './style.module.scss'
import myHooks from '@/tool/myHooks/myHooks'

const App: React.FC<{
  setmode: Function
  setOpenModal: Function
}> = (props) => {
  const setUserInfo = useSetRecoilState(userInfoState)
  const [openFindpassModal, setOpenFindpassModal] = useState(false)
  const notification = useRecoilValue(notificationApi)
  const [loading, setLoading] = useState(false)

  const onFinish = (values: any) => {
    setLoading(true)
    const form = new FormData()
    form.append('Email', values.Email)
    form.append('Password', values.Password)
    loginApi(form)
      .then((res) => {
        if (res.data.code === 200) {
          console.log(res)
          const token = res.data.data.token
          localStorage.setItem('token', token)
          getCurrentUserinfo().then((res) => {
            console.log(res.data)
            setUserInfo(res.data.data.user)
            props.setOpenModal(false)
          })
          notification &&
            notification.success({
              message: '欢迎',
              duration: 1,
            })
          // window.history.back()

          return Promise.resolve()
        }
      })
      .catch((err) => {
        notification &&
          notification.error({
            message: '登录失败',
            description: '',
          })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className={style.login}>
        <Button type="link" icon={<RightOutlined />} onClick={() => props.setmode('Register')} className="my-4">
          注册
        </Button>
        <Form size="large" className={style.form} name="normal_login" onFinish={onFinish}>
          <Form.Item
            name="Email"
            rules={[
              {
                type: 'email',
                message: '邮箱格式错误',
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="邮箱" />
          </Form.Item>
          <Form.Item
            name="Password"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
          >
            <Input prefix={<LockOutlined />} type="Password" placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="link" onClick={() => setOpenFindpassModal(true)}>
              忘记密码
            </Button>
          </Form.Item>
          <Form.Item className="text-center">
            <Button loading={loading} type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
      <FindPass openFindPwModal={openFindpassModal} setOpenFindPwModal={setOpenFindpassModal}></FindPass>
    </div>
  )
}

export default App
