import { userInfoState } from '@/store/appStore'
import { iconBaseUrl, imgGetBaseUrl } from '@/config/apiConfig'
import { Avatar, Button, Col, Descriptions, Divider, Form, Input, Radio, Row, Segmented, Select, Space, Upload, UploadFile } from 'antd'
import React, { useCallback, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { ManOutlined, WomanOutlined } from '@ant-design/icons'
import diamond from '@/assets/diamond.svg'
import gold from '@/assets/gold.svg'
import sliver from '@/assets/sliver.svg'
import copper from '@/assets/copper.svg'
import { uploadImgApi } from '@/api/img'
// import ImgCrop from 'antd-img-crop'

const Info: React.FC = () => {
  const info = useRecoilValue(userInfoState)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [iconUrl, setIconUrl] = useState(info?.icon)

  const handleClick = () => {
    const data = form.getFieldsValue()
    console.log(data)
  }
  const uploadImg = async (file: UploadFile) => {
    file.status = 'uploading'
    setFileList([file])
    const form = new FormData()
    form.append('file', file as any)
    const {
      data: { code, data, msg }
    } = await uploadImgApi(form)
    if (code === 200) {
      file.status = 'done'
      file.url = `${imgGetBaseUrl}/${data.Icon}`
      setIconUrl(`${imgGetBaseUrl}/${data.Icon}`)
      setFileList([file])
    }
  }
  const beforeUpload = (file: UploadFile) => {
    uploadImg(file)
  }

  const handleRemove = () => {}
  return (
    <div
      className=''
      style={{
        width: '768px'
      }}
    >
      <div className='flex justify-center'>
        <div>
          {/* <ImgCrop rotationSlider> */}
          <Upload
            beforeUpload={beforeUpload}
            fileList={fileList}
            onRemove={handleRemove}
          >
            <Avatar
              src={`${imgGetBaseUrl}/${iconUrl}`}
              size={128}
            ></Avatar>
          </Upload>
          {/* </ImgCrop> */}
        </div>
      </div>
      <div className='flex justify-center'>
        <Space>
          <img
            src={diamond}
            alt=''
            className='w-24'
          />
          <img
            src={gold}
            alt=''
            className='w-24'
          />
          <img
            src={sliver}
            alt=''
            className='w-24'
          />
          <img
            src={copper}
            alt=''
            className='w-24'
          />
        </Space>
      </div>
      <Divider></Divider>
      <Descriptions size='small'>
        <Descriptions.Item label={'权限等级'}>{String(info?.level)}</Descriptions.Item>
        <Descriptions.Item label={'竞赛分数'}>{String(info?.score)}</Descriptions.Item>
        <Descriptions.Item label={'收到点赞'}>{String(info?.like_num)}</Descriptions.Item>
        <Descriptions.Item label={'收到点踩'}>{String(info?.unlike_num)}</Descriptions.Item>
        <Descriptions.Item label={'收到收藏'}>{String(info?.collect_num)}</Descriptions.Item>
        <Descriptions.Item label={'被游览数'}>{String(info?.visit_num)}</Descriptions.Item>
      </Descriptions>
      <Divider></Divider>
      <Form
        layout='vertical'
        title='基本信息'
        form={form}
      >
        <Row className='w-full'>
          <Col span={8}>
            <Form.Item
              name={'name'}
              label='昵称'
            >
              <Input defaultValue={info?.name}></Input>
            </Form.Item>
          </Col>
          <Col span={1}></Col>
          <Col span={6}>
            <Form.Item
              name={'address'}
              label='城市'
            >
              <Input defaultValue={info?.address}></Input>
            </Form.Item>
          </Col>
          <Col span={1}></Col>
          <Col span={8}>
            <Form.Item
              name={'sex'}
              label='性别'
            >
              <Segmented
                block
                defaultValue={String(info?.sex)}
                options={[
                  {
                    label: (
                      <span>
                        <ManOutlined />男
                      </span>
                    ),
                    value: 'false'
                  },
                  {
                    label: (
                      <span>
                        <WomanOutlined />女
                      </span>
                    ),
                    value: 'true'
                  }
                ]}
              ></Segmented>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name={'blog'}
          label='个人网站'
        >
          <Input defaultValue={info?.blog}></Input>
        </Form.Item>
        <Form.Item
          name={'introduction'}
          label='个人介绍'
        >
          <Input.TextArea placeholder='关于你的个性、兴趣或经验'></Input.TextArea>
        </Form.Item>
        <div className='text-end'>
          <Button
            type='primary'
            onClick={handleClick}
          >
            保存
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default Info
