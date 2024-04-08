import { IProblem, ITopic } from '@/type'
import React, { useEffect, useState } from 'react'
import { Descriptions, Button, Popconfirm, Space, Avatar, Collapse, Divider } from 'antd'
import PaginationList from '../List/PaginationList'
import ProblemTable from '../Problem/table/ProblemTable'
import { NavLink } from 'react-router-dom'
import ReadOnly from '../editor/Readonly'
import { iconBaseUrl } from '@/config/apiConfig'
import MyCollapse from '../Collapse/MyCollapse'
import { getTopicProblemsApi } from '@/api/topic'
import { showProblemApi } from '@/api/problem'
import style from './style.module.scss'
import Loading from '../Loading/Loading'
import MyAvatar from '../Avatar/MyAvatar'

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
  const [problemList, setProblemList] = useState<IProblem[]>([])
  const [fetchDone, setFetchDone] = useState(false)
  const [pageProps, setPageProps] = useState({
    pageSize: 20,
    pageNum: 1,
    total: 0,
  })

  const fetchProblems = async (id: string) => {
    try {
      const problems = (await getTopicProblemsApi(id)).data.data.problemLists
      if (problems && problems.length === 0) {
        setFetchDone(true)
      } else {
        const list = []
        for (let problem of problems) {
          list.push({ ...problem, ...(await showProblemApi(problem.problem_id)).data.data.problem })
        }
        setProblemList(list.map((item, index) => ({ ...item, key: `${topic.id}-${item.id}-${index}` })))
      }
    } catch {}
  }

  const handleChange = (topic: ITopic | null) => {
    if (!topic || problemList.length > 0) return
    fetchProblems(topic.id)
  }

  const onPageChange = (pageNum: number, pageSize: number) => {
    setPageProps({ ...pageProps, pageNum, pageSize })
  }

  const renderActions = () => {
    const actions: React.ReactNode[] = []
    onDetail &&
      actions.push(
        <Button type="link" style={{ padding: '0' }} onClick={() => onDetail(topic, index)}>
          详情
        </Button>
      )
    onUpdate &&
      actions.push(
        <Button style={{ padding: '0' }} type="link" onClick={() => onUpdate(topic, index)}>
          更新
        </Button>
      )
    onDelete &&
      actions.push(
        <Popconfirm
          title="确定删除？"
          okText="确认"
          cancelText="取消"
          onConfirm={(e) => {
            onDelete(topic, index)
          }}
        >
          <Button style={{ padding: '0' }} type="link" danger>
            删除
          </Button>
        </Popconfirm>
      )
    return actions
  }

  return (
    <div>
      <MyCollapse
        onChange={(e) => handleChange(e?.length ? topic : null)}
        items={[
          {
            key: topic.id,
            label: (
              <div className={style.topicTitleWrapper}>
                <span className={style.title}>{topic.title}</span>
                <div className={style.extra}>
                  <Space split={<Divider type="vertical"></Divider>}>
                    <span>题目总数：{total}</span>
                    <span>{topic.updated_at}</span>
                    <MyAvatar user={topic.user}></MyAvatar>
                  </Space>
                </div>
              </div>
            ),
            extra: <Space onClick={(e) => e.stopPropagation()}>{renderActions().map((item) => item)}</Space>,
            children: (
              <div>
                <Descriptions size="small" layout="vertical">
                  <Descriptions.Item label={'创建者'}>
                    <Space>
                      <MyAvatar user={topic.user}></MyAvatar>
                      <NavLink to={''} className={'text-indigo-500 hover:text-indigo-500'}>
                        {topic.user?.name}
                      </NavLink>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label={'创建时间'}>{topic.created_at}</Descriptions.Item>
                  <Descriptions.Item label={'题目总数'}>{total}</Descriptions.Item>
                  {topic.content !== '' && (
                    <Descriptions.Item label="题单描述">
                      <ReadOnly html={topic.content}></ReadOnly>
                    </Descriptions.Item>
                  )}
                </Descriptions>
                <div className={style.problemTable}>
                  <ProblemTable
                    mode="default"
                    problemList={problemList}
                    pageNum={pageProps.pageNum}
                    pageSize={pageProps.pageSize}
                    total={pageProps.total}
                    fetchDone={fetchDone}
                    setFetchDone={setFetchDone}
                    onLineClick={() => {}}
                    onPageChange={onPageChange}
                  ></ProblemTable>
                </div>
              </div>
            ),
          },
        ]}
      ></MyCollapse>
    </div>
  )
}

export default TopicCollapse
