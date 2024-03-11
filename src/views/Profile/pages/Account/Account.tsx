import { loginStatusState, userInfoState } from '@/store/appStore'
import { Button, Col, Descriptions, Divider, Form, Input, Modal, Row, Space, Tooltip, notification } from 'antd'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { EditOutlined } from '@ant-design/icons'
import { findPasswordApi, getVerifyApi, updateInfoApi, updatePasswordApi } from '@/api/user'
import myHooks from '@/tool/myHooks/myHooks'
import { redirect, useNavigate } from 'react-router-dom'
import FindPass from '@/views/Login/log/FindPass'

const Account: React.FC = () => {
  const nav = myHooks.useNavTo()
  const [info, setInfo] = useRecoilState(userInfoState)
  const [form1] = Form.useForm()
  const [form3] = Form.useForm()
  const [openUpdateEmailModal, setOpenUpdateEmailModal] = useState(false)
  const [openUpdatePwModal, setOpenUpdatePwModal] = useState(false)
  const [openFindPwModal, setOpenFindPwModal] = useState(false)
  const [verifyBtnDisable, setVerifyBtnDisable] = useState(false)
  const { count, start } = myHooks.useCountdown(60, () => {
    setVerifyBtnDisable(false)
  })

  const updateEmail = () => {
    form3.validateFields().then((res) => {
      const data = {
        name: info?.name,
        email: res.email,
        blog: info?.blog,
        sex: info?.sex,
        address: info?.address,
        icon: info?.icon,
        res_long: info?.res_long,
        res_short: info?.res_short,
        verify: res.verify,
      }
      updateInfoApi(JSON.stringify(data)).then((res) => {
        console.log(res.data)
        if (res.data.code === 200) {
          const newInfo = res.data.data.user
          setInfo(newInfo)
          notification.success({
            message: '邮箱更改成功',
            description: `新邮箱为：${newInfo.email}`,
          })
          setOpenUpdateEmailModal(false)
        } else {
          notification.error({
            message: res.data.msg,
          })
        }
      })
    })
  }

  const updatePassword = () => {
    form1.validateFields().then((res) => {
      const formData = new FormData()
      formData.append('first', res.first)
      formData.append('second', res.second)
      console.log(formData.get('first'))
      updatePasswordApi(formData).then((res) => {
        if (res.data.code === 200) {
          notification.success({
            message: '密码更改成功',
          })
          setOpenUpdatePwModal(false)
        } else {
          notification.error({
            message: res.data.msg,
          })
        }
      })
    })
  }

  const getVerify = (email: string) => {
    getVerifyApi(email).then((res) => {
      if (res.data.code === 200) {
        start()
        setVerifyBtnDisable(true)
        notification.success({
          message: '验证码获取成功',
          description: `验证码已发送至您的邮箱 ${email}`,
        })
      }
    })
  }

  const handleVerifyBtnClick = () => {
    if (!info) return
    const email = form3.getFieldValue('email')
    getVerify(email)
  }

  const handleLogoutClick = () => {
    localStorage.removeItem('token')
    setInfo(null)
    nav('/login')
  }
  return (
    <div
      style={{
        width: '768px',
      }}
    >
      <div className="flex items-center">
        <h3 className="label grow">账号信息</h3>
        <Button type="dashed" onClick={handleLogoutClick}>
          退出登录
        </Button>
      </div>
      <Divider></Divider>
      <Descriptions column={1}>
        <Descriptions.Item label="UID">{info?.id}</Descriptions.Item>
        <Descriptions.Item label="邮箱">
          <div>
            <span>{info?.email}</span>
            <span className="mx-4">
              <EditOutlined
                className="hover:cursor-pointer"
                style={{
                  color: 'red',
                }}
                onClick={() => setOpenUpdateEmailModal(true)}
              />
            </span>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="密码">
          <Space>
            <Button type="dashed" size="small" onClick={() => setOpenUpdatePwModal(true)}>
              更改密码
            </Button>
            <Button type="dashed" size="small" onClick={() => setOpenFindPwModal(true)}>
              找回密码
            </Button>
          </Space>
        </Descriptions.Item>
      </Descriptions>
      <h3 className="label">实名认证</h3>
      <Divider></Divider>
      <h3 className="label">关联第三方账号</h3>
      <Divider></Divider>

      <div className="text-center"></div>
      <Modal
        title="更改邮箱"
        open={openUpdateEmailModal}
        onCancel={() => setOpenUpdateEmailModal(false)}
        style={{
          translate: '0 50%',
        }}
        footer={[
          <Button key={'updateEmail'} type="primary" onClick={updateEmail}>
            确定
          </Button>,
        ]}
      >
        <Form layout="vertical" form={form3}>
          <Form.Item label="原邮箱：">
            <Input disabled defaultValue={info?.email}></Input>
          </Form.Item>
          <Form.Item
            name={'email'}
            label="新邮箱："
            rules={[
              {
                type: 'email',
                message: '邮箱格式错误',
              },
            ]}
          >
            <Input></Input>
          </Form.Item>
          <Row gutter={8}>
            <Col span={8}>
              <Form.Item
                name={'verify'}
                label="验证码："
                rules={[
                  {
                    type: 'string',
                    len: 6,
                    message: '验证码格式错误',
                  },
                ]}
              >
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label=" ">
                <Button disabled={verifyBtnDisable} onClick={handleVerifyBtnClick}>
                  {verifyBtnDisable && `${count} 秒后重新获取`}
                  {!verifyBtnDisable && '获取验证码'}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="更改密码"
        open={openUpdatePwModal}
        onCancel={() => setOpenUpdatePwModal(false)}
        style={{
          translate: '0 50%',
        }}
        footer={[
          <Button key={'updatePassword'} type="primary" onClick={() => updatePassword()}>
            确定
          </Button>,
        ]}
      >
        <Form form={form1} layout="vertical">
          <Form.Item
            name={'first'}
            label="旧密码："
            rules={[
              ({}) => ({
                validator(_, value) {
                  if (!value) return Promise.reject(new Error('请输入旧密码'))
                  else return Promise.resolve()
                },
              }),
            ]}
          >
            <Input.Password allowClear></Input.Password>
          </Form.Item>
          <Form.Item
            name={'second'}
            label="新密码："
            rules={[
              {
                type: 'string',
                min: 6,
                message: '密码长度最少为6位',
              },
              ({}) => ({
                validator(_, value) {
                  if (!value) return Promise.reject(new Error('请输入旧密码'))
                  else return Promise.resolve()
                },
              }),
            ]}
          >
            <Input.Password allowClear></Input.Password>
          </Form.Item>
          <Form.Item
            name={'confirm'}
            label="确认新密码："
            rules={[
              {
                type: 'string',
                min: 6,
                message: '密码长度最少为6位',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('second') === value) return Promise.resolve()
                  return Promise.reject(new Error('密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password allowClear></Input.Password>
          </Form.Item>
        </Form>
      </Modal>
      <FindPass openFindPwModal={openFindPwModal} setOpenFindPwModal={setOpenFindPwModal}></FindPass>
    </div>
  )
}

export default Account
