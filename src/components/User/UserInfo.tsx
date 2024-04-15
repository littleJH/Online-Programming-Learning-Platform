import { User } from '@/type'
import React, { useState } from 'react'
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
  Modal,
} from 'antd'
import { ManOutlined, WomanOutlined, MailOutlined, LinkOutlined, BulbOutlined } from '@ant-design/icons'
import { imgGetBaseUrl } from '@/config/apiConfig'
import MyAvatar from '../Avatar/MyAvatar'
import style from './style.module.scss'
import { createMessageApi } from '@/api/message'
import { useRecoilValue } from 'recoil'
import { notificationApi } from '@/store/appStore'

const UserInfo: React.FC<{ user: User }> = (props) => {
  const { user } = props
  const notification = useRecoilValue(notificationApi)
  const [openMessageModal, setOpenMessageModal] = useState(false)
  const [messageContent, setMessageContent] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    try {
      setLoading(true)
      const res = await createMessageApi(user.id, messageContent)
      if (notification) {
        res.data.code === 200
          ? notification.success({
              message: `给@${user.name}留言成功`,
              description: `留言信息：${messageContent}`,
            })
          : notification.error({
              message: `给@${user.name}留言失败`,
              description: res.data.msg,
            })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={style.userinfo}>
      <div className={style.header}>
        <div>
          <MyAvatar user={user} size={64}></MyAvatar>
        </div>
        <p>
          <span className={style.name}>@{user.name}</span>
          {user?.address && <span>&nbsp;· {user.address}</span>}
          <span
            style={{
              marginLeft: '1rem',
            }}
            className={style.sex}
          >
            {user.sex ? (
              <WomanOutlined
                style={{
                  color: 'pink',
                }}
              />
            ) : (
              <ManOutlined
                style={{
                  color: 'skyblue',
                }}
              />
            )}
          </span>
        </p>
        <p className={style.email}>
          <span className={style.icon}>
            <MailOutlined />
          </span>
          <span>{user.email}</span>
        </p>
        {user?.blog && (
          <p>
            <span className={style.icon}>
              <LinkOutlined />
            </span>
            <span>
              <a href={user.blog} target="_blank">
                {user.blog}
              </a>
            </span>
          </p>
        )}
        {user?.res_long && (
          <p>
            <span className={style.icon}>
              <BulbOutlined />
            </span>
            <span>{user.res_long}</span>
          </p>
        )}
      </div>

      <Divider></Divider>
      <Row>
        <Col style={{ textAlign: 'center' }} span={8}>
          <Statistic title="权限等级" value={String(user?.level)}></Statistic>
        </Col>
        <Col style={{ textAlign: 'center' }} span={8}>
          <Statistic title="竞赛分数" value={String(user?.score)}></Statistic>
        </Col>
        <Col style={{ textAlign: 'center' }} span={8}>
          <Statistic title="被游览数" value={String(user?.visit_num)}></Statistic>
        </Col>
      </Row>
      <Row>
        <Col style={{ textAlign: 'center' }} span={8}>
          <Statistic title="收到点赞" value={String(user?.like_num)}></Statistic>
        </Col>
        <Col style={{ textAlign: 'center' }} span={8}>
          <Statistic title="收到收藏" value={String(user?.collect_num)}></Statistic>
        </Col>
        <Col style={{ textAlign: 'center' }} span={8}>
          <Statistic title="收到点踩" value={String(user?.unlike_num)}></Statistic>
        </Col>
      </Row>
      <Divider></Divider>
      <Space align="end">
        <Button type="primary" size="small" onClick={() => setOpenMessageModal(true)}>
          给ta留言
        </Button>
        <Button type="primary" size="small">
          发送邮件
        </Button>
        <Button type="primary" size="small">
          加为好友
        </Button>
      </Space>
      <Modal
        title={`给@${user.name}留言`}
        open={openMessageModal}
        onCancel={() => setOpenMessageModal(false)}
        footer={[
          <Button key={1} onClick={() => setOpenMessageModal(false)}>
            取消
          </Button>,
          <Button loading={loading} key={2} type="primary" onClick={() => sendMessage()}>
            留言
          </Button>,
        ]}
      >
        <Input.TextArea
          rows={4}
          value={messageContent}
          onChange={(value) => setMessageContent(value.target.value)}
        ></Input.TextArea>
      </Modal>
    </div>
  )
}

export default UserInfo
