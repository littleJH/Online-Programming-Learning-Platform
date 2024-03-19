import { notificationApi, userInfoState } from '@/store/appStore'
import { iconBaseUrl, imgGetBaseUrl } from '@/config/apiConfig'
import {
  Avatar,
  Button,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Segmented,
  Statistic,
  Space,
  Tooltip,
  Upload,
  UploadFile,
} from 'antd'
import React, { useCallback, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { ManOutlined, WomanOutlined } from '@ant-design/icons'
import diamond from '@/assets/diamond.svg'
import gold from '@/assets/gold.svg'
import sliver from '@/assets/sliver.svg'
import copper from '@/assets/copper.svg'
import { uploadImgApi } from '@/api/img'
import copy from 'copy-to-clipboard'
import { getCurrentUserinfo, updateInfoApi } from '@/api/user'
// import ImgCrop from 'antd-img-crop'

const Info: React.FC = () => {
  const [info, setInfo] = useRecoilState(userInfoState)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [iconUrl, setIconUrl] = useState(info?.icon)
  const notification = useRecoilValue(notificationApi)

  const handleClick = async () => {
    const formValue = form.getFieldsValue(true)
    const newInfo = { ...info, ...formValue }
    if (typeof newInfo.sex === 'string') {
      if (newInfo.sex === 'true') newInfo.sex = true
      if (newInfo.sex === 'false') newInfo.sex = false
    }
    const { data } = await updateInfoApi(JSON.stringify(newInfo))
    if (data.code === 200) {
      const res = await getCurrentUserinfo()
      setInfo(res.data.data.user)
      notification &&
        notification.success({
          message: '保存成功',
        })
    }
  }
  const uploadImg = async (file: UploadFile) => {
    file.status = 'uploading'
    setFileList([file])
    const form = new FormData()
    form.append('file', file as any)
    const {
      data: { code, data, msg },
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

  const handleIdClick = () => {
    if (!info?.id) return
    const flag = copy(info?.id)
    if (flag) {
      notification &&
        notification.success({
          message: '已复制到剪切板',
        })
    }
  }

  return (
    <div
      className=""
      style={{
        width: '768px',
        padding: '0 10rem',
      }}
    >
      <div className="flex justify-center">
        <div>
          {/* <ImgCrop rotationSlider> */}
          <Upload beforeUpload={beforeUpload} fileList={fileList} onRemove={handleRemove}>
            <Avatar src={`${imgGetBaseUrl}/${iconUrl}`} size={128}></Avatar>
          </Upload>
          {/* </ImgCrop> */}
        </div>
      </div>
      <Divider></Divider>
      {/* <div className='flex justify-center'>
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
      </div> */}
      <div style={{ textAlign: 'center', letterSpacing: '1px' }}>
        <span> ID：</span>
        <Tooltip title={`${info?.id} 点击复制`} placement="bottom">
          <span onClick={handleIdClick} style={{ userSelect: 'none' }}>
            {info?.id}
          </span>
        </Tooltip>
      </div>
      <Divider></Divider>
      <Row>
        <Col style={{ textAlign: 'center' }} span={8}>
          <Statistic title="权限等级" value={String(info?.level)}></Statistic>
        </Col>
        <Col style={{ textAlign: 'center' }} span={8}>
          <Statistic title="竞赛分数" value={String(info?.score)}></Statistic>
        </Col>
        <Col style={{ textAlign: 'center' }} span={8}>
          <Statistic title="被游览数" value={String(info?.visit_num)}></Statistic>
        </Col>
      </Row>
      <Row>
        <Col style={{ textAlign: 'center' }} span={8}>
          <Statistic title="收到点赞" value={String(info?.like_num)}></Statistic>
        </Col>
        <Col style={{ textAlign: 'center' }} span={8}>
          <Statistic title="收到收藏" value={String(info?.collect_num)}></Statistic>
        </Col>
        <Col style={{ textAlign: 'center' }} span={8}>
          <Statistic title="收到点踩" value={String(info?.unlike_num)}></Statistic>
        </Col>
      </Row>

      <Divider></Divider>
      <Form layout="vertical" title="基本信息" form={form}>
        <Row className="w-full">
          <Col span={8}>
            <Form.Item name={'name'} label="昵称">
              <Input defaultValue={info?.name}></Input>
            </Form.Item>
          </Col>
          <Col span={1}></Col>
          <Col span={6}>
            <Form.Item name={'address'} label="城市">
              <Input defaultValue={info?.address}></Input>
            </Form.Item>
          </Col>
          <Col span={1}></Col>
          <Col span={8}>
            <Form.Item name={'sex'} label="性别">
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
                    value: 'false',
                  },
                  {
                    label: (
                      <span>
                        <WomanOutlined />女
                      </span>
                    ),
                    value: 'true',
                  },
                ]}
              ></Segmented>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name={'blog'} label="个人网站">
          <Input defaultValue={info?.blog}></Input>
        </Form.Item>
        <Form.Item name={'res_long'} label="个人介绍">
          <Input.TextArea defaultValue={info?.res_long} placeholder="关于你的个性、兴趣或经验"></Input.TextArea>
        </Form.Item>
        <div className="text-end">
          <Button type="primary" onClick={handleClick}>
            保存
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default Info
