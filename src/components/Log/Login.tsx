import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, notification } from 'antd'
import '../Log/log.scss'
import { NavLink, useNavigate } from 'react-router-dom'
import { loginApi } from '@/api/user'

const App: React.FC<{
  setOpenModal: Function
  setmode: Function
}> = props => {
  const nav = useNavigate()
  const emailValidator = (_: any, value: any) => {
    const reg =
      /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    if (value === '') {
      return Promise.resolve()
    } else {
      if (!reg.test(value)) {
        return Promise.reject('请输入正确的邮箱地址')
      } else {
        return Promise.resolve()
      }
    }
  }
  const onFinish = (values: any) => {
    const form = new FormData()
    form.append('Email', values.Email)
    form.append('Password', values.Password)
    loginApi(form).then(res => {
      if (res.data.code === 200) {
        props.setOpenModal(false)
        notification.success({
          message: '欢迎',
          placement: 'topRight'
        })
      }
      console.log(res)
      const token = res.data.data.token
      localStorage.setItem('token', token)
    })
  }

  return (
    <Form
      style={{ width: '20rem' }}
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="Email"
        rules={[
          {
            validator: emailValidator
          }
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Email"
        />
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
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="Password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or
        <Button type="link" onClick={() => props.setmode('register')}>
          注册
        </Button>
      </Form.Item>
    </Form>
  )
}

export default App
