import { User } from '@/type'
import React from 'react'
import { Avatar, Button, Col, Descriptions, Divider, Form, Input, Radio, Row, Segmented, Statistic, Space, Tooltip, Upload, UploadFile } from 'antd'
import { imgGetBaseUrl } from '@/config/apiConfig'

const UserInfo: React.FC<{ user: User }> = (props) => {
  const { user } = props
  return (
    <div>
      <div className='flex justify-center'>
        <Avatar
          src={`${imgGetBaseUrl}/${user.icon}`}
          size={128}
        ></Avatar>
      </div>
      <Row>
        <Col
          style={{ textAlign: 'center' }}
          span={8}
        >
          <Statistic
            title='权限等级'
            value={String(user?.level)}
          ></Statistic>
        </Col>
        <Col
          style={{ textAlign: 'center' }}
          span={8}
        >
          <Statistic
            title='竞赛分数'
            value={String(user?.score)}
          ></Statistic>
        </Col>
        <Col
          style={{ textAlign: 'center' }}
          span={8}
        >
          <Statistic
            title='被游览数'
            value={String(user?.visit_num)}
          ></Statistic>
        </Col>
      </Row>
      <Row>
        <Col
          style={{ textAlign: 'center' }}
          span={8}
        >
          <Statistic
            title='收到点赞'
            value={String(user?.like_num)}
          ></Statistic>
        </Col>
        <Col
          style={{ textAlign: 'center' }}
          span={8}
        >
          <Statistic
            title='收到收藏'
            value={String(user?.collect_num)}
          ></Statistic>
        </Col>
        <Col
          style={{ textAlign: 'center' }}
          span={8}
        >
          <Statistic
            title='收到点踩'
            value={String(user?.unlike_num)}
          ></Statistic>
        </Col>
      </Row>
    </div>
  )
}

export default UserInfo
