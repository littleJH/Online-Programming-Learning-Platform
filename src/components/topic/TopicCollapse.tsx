import { ITopic } from '@/type'
import React from 'react'
import { Descriptions, Button, Popconfirm, Space, Avatar, Collapse } from 'antd'
import GeneralList from '../List/GeneralList'
import ProblemTable from '../Problem/ProblemTable'
import { NavLink } from 'react-router-dom'
import ReadOnly from '../editor/Readonly'
import { iconBaseUrl } from '@/config/apiConfig'

interface IProps {
  topic: ITopic
  index: number
  total: number
  onDelete?: Function
  onDetail?: Function
  onUpdate?: Function
}

const TopicCollapse: React.FC<IProps> = (props) => {
  const { topic, index, total, onDelete, onDetail, onUpdate } = props
  const renderActions = () => {
    const actions: React.ReactNode[] = []
    onDetail &&
      actions.push(
        <Button
          type='link'
          style={{ padding: '0' }}
          onClick={() => onDetail(topic, index)}
        >
          详情
        </Button>
      )
    onUpdate &&
      actions.push(
        <Button
          style={{ padding: '0' }}
          type='link'
          onClick={() => onUpdate(topic, index)}
        >
          更新
        </Button>
      )
    onDelete &&
      actions.push(
        <Popconfirm
          title='确定删除该文章？'
          okText='确认'
          cancelText='取消'
          onConfirm={() => onDelete(topic, index)}
        >
          <Button
            style={{ padding: '0' }}
            type='link'
            danger
          >
            删除
          </Button>
        </Popconfirm>
      )
    return actions
  }

  return (
    <div>
      <Collapse
        items={[
          {
            key: topic.id,
            label: topic.title,
            extra: <Space>{renderActions().map((item) => item)}</Space>,
            children: (
              <>
                <Descriptions
                  size='small'
                  layout='vertical'
                >
                  <Descriptions.Item label={'创建者'}>
                    <Space>
                      <Avatar src={`${iconBaseUrl}/${topic.user?.icon}`}></Avatar>
                      <NavLink
                        to={''}
                        className={'text-indigo-500 hover:text-indigo-500'}
                      >
                        {topic.user?.name}
                      </NavLink>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label={'创建时间'}>{topic.created_at}</Descriptions.Item>
                  <Descriptions.Item label={'题目总数'}>{total}</Descriptions.Item>
                  {topic.content !== '' && (
                    <Descriptions.Item label='题单描述'>
                      <ReadOnly html={topic.content}></ReadOnly>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </>
            )
          }
        ]}
      ></Collapse>
    </div>
  )
}

export default TopicCollapse
