import React, { useCallback, useState } from 'react'
import { Form, Select, Button, Input, Row, Col, message, Upload, Space, UploadFile } from 'antd'
import { LoadingOutlined, PlusOutlined, LeftOutlined } from '@ant-design/icons'
import myHooks from '@/tool/myHooks/myHooks'
import { registerApi, getVerifyApi } from '@/api/user'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { notificationApi } from '@/store/appStore'
import { uploadImgApi } from '@/api/img'
import { imgGetBaseUrl } from '@/config/apiConfig'

const Register: React.FC<{
  setmode: Function
  setOpenModal: Function
}> = (props) => {
  const notification = useRecoilValue(notificationApi)
  const [verifyed, setverifyed] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verifyText, setverifyText] = useState('获取验证码')
  const [loading, setLoading] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [iconFile, setIconFile] = useState<UploadFile[]>([])
  const [imageUrl, setImageUrl] = useState<string>()
  const [form] = Form.useForm()
  const { Option } = Select

  const { count, start } = myHooks.useCountdown(10, () => {
    setverifyed(false)
    setverifyText('重新获取验证码')
  })

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  const beforeIconUpload = async (file: UploadFile) => {
    file.status = 'uploading'
    setIconFile([file])
    const formdata = new FormData()
    formdata.append('file', file as any)
    try {
      const { code, data, msg } = (await uploadImgApi(formdata)).data
      if (code === 200) {
        file.status = 'done'
        file.url = `${imgGetBaseUrl}/${data.Icon}`
        setImageUrl(`${data.Icon}`)
        setIconFile([file])
        form.setFieldValue('icon', data.Icon)
      }
    } catch {}
  }
  const handleRemoveIcon = () => {
    setImageUrl('')
    setIconFile([])
    form.setFieldValue('icon', '')
  }

  const handleVerifyBtnClick = () => {
    const email = form.getFieldValue('Email')
    if (!email) {
      form.setFields([{ name: 'Email', errors: ['请输入邮箱地址'] }])
      form.scrollToField('Email')
    } else {
      setVerifying(true)
      getVerifyApi(email)
        .then((res) => {
          if (res.data.code === 200) {
            start()
            setverifyed(true)
            notification &&
              notification.success({
                message: '验证码获取成功',
                description: `验证码已发送至您的邮箱 ${email}`,
              })
          }
        })
        .finally(() => {
          setVerifying(false)
        })
    }
  }

  const onFinish = (form: any) => {
    console.log('🚀 ~ onFinish ~ form:', form)
    setRegistering(true)
    const data = new FormData()
    data.append('Email', form.Email)
    data.append('Password', form.Password)
    data.append('Name', form.Name)
    data.append('Verify', form.Verify)

    registerApi(data)
      .then((res) => {
        console.log('🚀 ~ .then ~ res:', res)
        if (res.data.code === 200) {
          const data = new FormData()
          data.append('name', form.Name)
          data.append('email', form.Email)
          data.append('blog', form.blog)
          data.append('sex', form.sex)
          data.append('address', form.address)
          data.append('icon', form.icon)
        }
      })
      .finally(() => {
        setRegistering(false)
      })
  }

  return (
    <div className={style.register}>
      <Button type="link" icon={<LeftOutlined />} onClick={() => props.setmode('Login')} className="my-4">
        登录
      </Button>
      <Form
        className={style.form}
        layout="vertical"
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{}}
        scrollToFirstError
      >
        <Form.Item
          name="Email"
          label="邮箱："
          rules={[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '邮箱格式错误' },
          ]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item name={'Password'} label="密码：" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password></Input.Password>
        </Form.Item>
        <Form.Item
          name={'Confirm'}
          label="确认密码："
          dependencies={['Password']}
          rules={[
            { required: true, message: '请确认密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('Password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('密码不一致'))
              },
            }),
          ]}
        >
          <Input.Password></Input.Password>
        </Form.Item>
        <Form.Item
          name={'Name'}
          label="昵称："
          rules={[
            {
              required: true,
              message: '您还没有取一个昵称',
            },
            { max: 20, min: 1, message: '昵称长度限制在1-20' },
          ]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item name={'blog'} label="Blog：">
          <Input></Input>
        </Form.Item>
        <Form.Item name={'sex'} label="性别：">
          <Select>
            <Option value={false}>男</Option>
            <Option value={true}>女</Option>
          </Select>
        </Form.Item>
        <Form.Item name={'address'} label="地址：">
          <Input></Input>
        </Form.Item>
        <Form.Item label="头像：">
          <Upload
            beforeUpload={beforeIconUpload}
            onRemove={handleRemoveIcon}
            fileList={iconFile}
            name="icon"
            listType="picture-card"
            showUploadList={false}
          >
            {imageUrl ? (
              <img src={`${imgGetBaseUrl}/${imageUrl}`} alt="头像" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Form.Item name={'Verify'} label="验证码：">
          <Row gutter={8}>
            <Col span={14}>
              <Form.Item name={'Verify'} noStyle rules={[{ required: true, message: '您还没有输入验证码' }]}>
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Button loading={verifying} style={{ fontSize: '12px', width: '100%' }} onClick={handleVerifyBtnClick}>
                {verifyed && `${count}s 后重新获取`}
                {!verifyed && verifyText}
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item className="text-center">
          <Button loading={registering} size="middle" style={{}} htmlType="submit" type="primary">
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Register
