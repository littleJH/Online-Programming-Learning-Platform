import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import copy from 'copy-to-clipboard'
import {
  getProblemLabelsApi,
  getProblemListApi,
  searchProblemByLabelApi,
  searchProblemByTextAndLabelApi,
  searchProblemByTextApi,
  showProblemApi
} from '@/api/problem'
import {
  Avatar,
  Collapse,
  Descriptions,
  Input,
  Modal,
  Popover,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  Tooltip,
  notification
} from 'antd'
import { getRecordListApi } from '@/api/record'
import Column from 'antd/es/table/Column'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import AcPercentLabel from '@/components/Label/ProblemLabel/AcPercentLabel'
import { IPrblemTableDataType, IProblem, ITopic } from '@/vite-env'
import { getTagListApi } from '@/api/tag'
import ReadOnly from '@/components/Editor/ReadOnly'
import {
  getTopicApi,
  getTopicListApi,
  getTopicProblemsApi,
  searchProblemInTopicByLabelApi,
  searchProblemInTopicByTextApi,
  searchProblemInTopicByTextLabelApi
} from '@/api/topic'
import { getUserInfoApi } from '@/api/user'
import { iconBaseUrl } from '@/api/baseConfig'

interface ITag {
  label: string
  checked: boolean
}
interface IProps {
  mode: 'select' | 'default'
  width: number
  selectedProblems?: {
    key: string
    title: string
  }[]
  setSelectedProblems?: Function
  selectedRowKeys?: React.Key[]
}
interface TopicOptionType {
  value: string
  label: string
}

let first = true

const ProblemList: React.FC<IProps> = props => {
  const {
    mode,
    width,
    selectedProblems,
    setSelectedProblems,
    selectedRowKeys
  } = props
  const [querys, setQuerys] = useSearchParams()
  const nav = useNavigate()
  const { Search } = Input
  const [problemList, setproblemList] = useState<IPrblemTableDataType[]>([])
  const [topicList, setTopicList] = useState<ITopic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<ITopic | undefined>()
  const [topic_id, setTopic_id] = useState(
    querys.get('topic') ? (querys.get('topic') as string) : ''
  )
  const [tagList, setTagList] = useState<ITag[]>([])
  const [fetchDone, setFetchDone] = useState(false)
  const searchMode = useRef<
    'default' | 'textSearch' | 'labelSearch' | 'text&label'
  >('default')
  const [searchText, setSearchText] = useState<string>(
    querys.get('text') ? (querys.get('text') as string) : ''
  )
  const [labelGroup, setLabelGroup] = useState<string[]>(
    querys.get('labels') ? JSON.parse(querys.get('labels') as string) : []
  )
  const [total, setTotal] = useState(0)
  const pageNum = useRef(1)
  const pageSize = useRef(20)
  const leftCtn = useRef<HTMLDivElement>(null)
  const searchCtn = useRef<HTMLDivElement>(null)
  const [tableScrollHeight, setTableScrollHeight] = useState(0)

  useEffect(() => {
    if (!topic_id && !searchText.length && !labelGroup.length) {
      initProblemList()
    } else {
      if (!searchText.length && !labelGroup.length && topic_id)
        fetchTopics(topic_id)
      else if (searchText.length) searchProblemByText()
      else if (labelGroup.length) searchProblemsByLabels()
    }
    if (topic_id) {
      getTopicApi(topic_id).then(res => {
        setSelectedTopic(res.data.data.topic)
      })
    }
    getTopicListApi().then(res => {
      const topics = res.data.data.topics
      setTopicList(topics)
    })
    getTagListApi(1, 10000).then(res => {
      const list: ITag[] = []
      const tags = res.data.data.tags
      tags.forEach((item: any) =>
        list.push({
          label: item.tag,
          checked: labelGroup.find(value => value === item.tag) ? true : false
        })
      )
      setTagList(list)
    })
  }, [])

  useEffect(() => {
    const resize = () => {
      if (leftCtn.current && searchCtn.current) {
        setTableScrollHeight(
          leftCtn.current.clientHeight - searchCtn.current?.clientHeight - 80
        )
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('reseize', resize)
    }
  }, [problemList])

  useEffect(() => {
    fetchDone
      ? document.querySelector('#mainContent')?.scrollTo({
          left: 0,
          top: 0
        })
      : null
  }, [fetchDone])

  useEffect(() => {
    const list: string[] = []
    tagList.forEach(item => {
      item.checked ? list.push(item.label) : null
    })
    setLabelGroup(list)
  }, [tagList])

  const topicOptions = useMemo(() => {
    const list: TopicOptionType[] = []
    topicList.forEach(topic =>
      list.push({
        value: topic.id,
        label: topic.title
      })
    )
    return list
  }, [topicList])

  // 监听selectedTopic清空
  useEffect(() => {
    if (first) return
    if (!labelGroup.length && !searchText.length) initProblemList()
    else if (labelGroup.length) searchProblemsByLabels()
    else if (searchText.length) searchProblemByText()
    else searchProblemByTextAndLabel()
  }, [topic_id])

  // 监听serachText清空
  useEffect(() => {
    if (first) return
    if (!searchText.length)
      if (!labelGroup.length && !topic_id) initProblemList()
      else if (labelGroup.length) searchProblemsByLabels()
      else if (topic_id) fetchTopics(topic_id)
  }, [searchText, topic_id])

  // 监听labelGroup
  useEffect(() => {
    setQuerys(() => {
      return [
        ['topic', topic_id],
        ['text', searchText],
        ['labels', JSON.stringify(labelGroup)]
      ]
    })
    if (first) return
    if (labelGroup.length) {
      searchText.length
        ? searchProblemByTextAndLabel()
        : searchProblemsByLabels()
    } else {
      if (!searchText.length && !topic_id) initProblemList()
      else if (searchText.length) searchProblemByText()
      else if (topic_id) fetchTopics(topic_id)
    }
  }, [labelGroup, topic_id])

  const initProblemList = useCallback(() => {
    searchMode.current = 'default'
    getProblemListApi(pageNum.current, pageSize.current).then(problemsRes => {
      console.log(problemsRes.data.data)
      setTotal(problemsRes.data.data.total)
      fetchProblems(problemsRes.data.data.problems)
    })
  }, [])

  const fetchProblems = useCallback(async (problems: IProblem[]) => {
    setFetchDone(false)
    let index = 0
    const list: IPrblemTableDataType[] = []
    for (let problem of problems) {
      const res = await Promise.all([
        getRecordListApi({
          problem_id: problem.id
        }),
        getRecordListApi({
          problem_id: problem.id,
          condition: 'Accepted'
        }),
        getProblemLabelsApi(problem.id)
      ])
      list.push({
        key: problem.id as string,
        index: (pageNum.current - 1) * pageSize.current + index + 1,
        title: problem.title,
        description: problem.description,
        totaRecords: res[0].data.data.total,
        accpet: res[1].data.data.total,
        acPerc: (
          <AcPercentLabel
            total={res[0].data.data.total}
            accept={res[1].data.data.total}
          ></AcPercentLabel>
        ),
        labels: res[2].data.data.problemLabels
      })
      index++
    }
    setproblemList(list)
    setFetchDone(true)
    first = false
  }, [])

  const fetchTopics = useCallback(async (topic_id: string) => {
    searchMode.current = 'default'
    setFetchDone(false)
    const res = await getTopicProblemsApi(topic_id)
    const list = res.data.data.problemLists
    setTotal(list.length)
    const problems: IProblem[] = []
    for (let index = 0; index < list.length; index++) {
      const res = await showProblemApi(list[index].problem_id)
      problems.push(res.data.data.problem)
    }
    fetchProblems(problems)
  }, [])

  const toDetail = (index: number) => {
    const id = problemList[index].key
    nav(`/problem/${id}`)
  }

  const searchProblemByText = useCallback(() => {
    searchMode.current === 'textSearch'
    if (topic_id) {
      searchProblemInTopicByTextApi(
        topic_id,
        searchText,
        pageNum.current,
        pageSize.current
      ).then(res => {
        console.log(res.data)
        setTotal(res.data.data.total)
        fetchProblems(res.data.data.problems)
      })
    } else {
      searchProblemByTextApi(
        searchText,
        pageNum.current,
        pageSize.current
      ).then(res => {
        console.log(res.data)
        setTotal(res.data.data.total)
        fetchProblems(res.data.data.problems)
      })
    }
  }, [searchText, topic_id])

  const searchProblemsByLabels = useCallback(() => {
    searchMode.current = 'labelSearch'
    if (topic_id) {
      searchProblemInTopicByLabelApi(
        topic_id,
        labelGroup,
        pageNum.current,
        pageSize.current
      ).then(res => {
        console.log(res.data.data)
        setTotal(res.data.data.total)
        fetchProblems(res.data.data.problems)
      })
    } else {
      searchProblemByLabelApi(
        labelGroup,
        pageNum.current,
        pageSize.current
      ).then(res => {
        console.log(res.data.data)
        setTotal(res.data.data.total)
        fetchProblems(res.data.data.problems)
      })
    }
  }, [labelGroup, topic_id])

  const searchProblemByTextAndLabel = useCallback(() => {
    searchMode.current = 'text&label'
    if (topic_id) {
      searchProblemInTopicByTextLabelApi(
        topic_id,
        searchText,
        labelGroup,
        pageNum.current,
        pageSize.current
      ).then(res => {
        console.log(res.data)
        setTotal(res.data.data.total)
        fetchProblems(res.data.data.problems)
      })
    } else {
      searchProblemByTextAndLabelApi(
        searchText,
        labelGroup,
        pageNum.current,
        pageSize.current
      ).then(res => {
        console.log(res.data)
        setTotal(res.data.data.total)
        fetchProblems(res.data.data.problems)
      })
    }
  }, [searchText, labelGroup, topic_id])

  const handleTopicChange = useCallback(
    async (value: string) => {
      const topic = topicList.find(topic => topic.id === value)
      if (topic) {
        const res = await getUserInfoApi(topic.user_id)
        topic.user = res.data.data.user
      }
      setTopic_id(topic ? topic?.id : '')
      setSelectedTopic(topic)
      setQuerys(() => {
        return [
          ['topic', topic_id],
          ['text', searchText],
          ['labels', JSON.stringify(labelGroup)]
        ]
      })
    },
    [topicList, searchText, topic_id, labelGroup]
  )

  const handleSearch = useCallback(() => {
    if (!searchText.length) return
    if (!labelGroup.length) {
      searchMode.current = 'textSearch'
      searchProblemByText()
    } else {
      searchMode.current = 'text&label'
      searchProblemByTextAndLabel()
    }
  }, [searchText, labelGroup])

  const handleKyeClick = useCallback((value: string) => {
    const flag = copy(value)
    if (flag) {
      notification.success({
        message: '已复制到剪切板',
        placement: 'topRight',
        duration: 1
      })
    }
  }, [])

  const handleTagClick = useCallback(
    (index: number) => {
      const list = [...tagList]
      list[index].checked = !list[index].checked
      setTagList(list)
    },
    [tagList]
  )

  const handleDeselect = useCallback(
    (value: string) => {
      const list = [...tagList]
      const index = tagList.findIndex(item => item.label === value)
      list[index].checked = false
      setTagList(list)
    },
    [tagList]
  )

  const handleClear = useCallback(() => {
    const list = [...tagList]
    list.forEach(item => (item.checked = false))
    setTagList(list)
  }, [tagList, topic_id, searchText])

  const handlePageChange = useCallback(
    (num: number, size: number) => {
      pageNum.current = num
      pageSize.current = size
      switch (searchMode.current) {
        case 'default':
          topic_id ? fetchTopics(topic_id) : initProblemList()
          break
        case 'textSearch':
          searchProblemByText()
          break
        case 'labelSearch':
          searchProblemsByLabels()
          break
        case 'text&label':
          searchProblemByTextAndLabel()
          break
      }
    },
    [selectedProblems, topic_id]
  )

  return (
    <>
      <div
        className="flex h-full"
        style={{
          width: `${width}px`,
          maxWidth: '1024px'
        }}
      >
        <div ref={leftCtn} className="grow" style={{ width: '1px' }}>
          <Space ref={searchCtn} className="py-4">
            <Select
              style={{
                width: '128px'
              }}
              allowClear
              placeholder="选择题单"
              value={selectedTopic?.id}
              onChange={handleTopicChange}
              options={topicOptions}
            ></Select>
            <Popover
              overlayStyle={{
                maxWidth: '1024px'
              }}
              trigger={'click'}
              content={
                <div>
                  {tagList.map((item: ITag, index) => (
                    <Tag
                      key={index}
                      style={{
                        margin: '0.5rem 0.25rem'
                      }}
                      color={`${item.checked ? '#6366f1' : '#f1f5f9'}`}
                    >
                      <div
                        className={`hover:cursor-pointer select-none ${
                          item.checked ? 'text-white' : 'text-slate-700'
                        }`}
                        onClick={() => handleTagClick(index)}
                      >
                        {item.label}
                      </div>
                    </Tag>
                  ))}
                </div>
              }
            >
              <Select
                mode="multiple"
                showSearch={false}
                style={{ minWidth: '128px' }}
                allowClear
                maxTagCount={3}
                placeholder="标签筛选"
                open={false}
                value={labelGroup}
                onDeselect={handleDeselect}
                onClear={handleClear}
              ></Select>
            </Popover>
            <Search
              style={{
                width: '128px'
              }}
              defaultValue={searchText}
              placeholder="文本搜索"
              enterButton
              onSearch={handleSearch}
              onChange={event => {
                setSearchText(event.target.value)
                setQuerys(() => {
                  return [
                    ['topic', topic_id],
                    ['text', event.target.value],
                    ['labels', JSON.stringify(labelGroup)]
                  ]
                })
              }}
            ></Search>
          </Space>
          {selectedTopic && (
            <Collapse
              style={{
                margin: '0 0 1rem 0'
              }}
              items={[
                {
                  key: selectedTopic.id,
                  label: selectedTopic.title,
                  children: (
                    <>
                      <Descriptions size="small" layout="vertical">
                        <Descriptions.Item label={'创建者'}>
                          <Space>
                            <Avatar
                              src={`${iconBaseUrl}/${selectedTopic.user?.icon}`}
                            ></Avatar>
                            <NavLink
                              to={''}
                              className={
                                'text-indigo-500 hover:text-indigo-500'
                              }
                            >
                              {selectedTopic.user?.name}
                            </NavLink>
                          </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label={'创建时间'}>
                          {selectedTopic.created_at}
                        </Descriptions.Item>
                        <Descriptions.Item label={'题目总数'}>
                          {total}
                        </Descriptions.Item>
                        <Descriptions.Item label="题单描述">
                          <ReadOnly html={selectedTopic.content}></ReadOnly>
                        </Descriptions.Item>
                      </Descriptions>
                    </>
                  )
                }
              ]}
            ></Collapse>
          )}
          {!fetchDone ? (
            <Skeleton
              style={{
                width: '100%'
              }}
              active
              paragraph={{
                rows: pageSize.current
              }}
            />
          ) : (
            <Table
              scroll={
                mode === 'select'
                  ? {
                      y: tableScrollHeight
                    }
                  : undefined
              }
              rowSelection={
                mode === 'select' && setSelectedProblems
                  ? {
                      columnWidth: 64,
                      selectedRowKeys: selectedRowKeys,
                      onChange: (value, selectedRows, info) => {
                        if (info.type === 'all') {
                          value.length
                            ? setSelectedProblems((prev: any) => [
                                ...prev,
                                ...selectedRows
                              ])
                            : setSelectedProblems(
                                (prev: IPrblemTableDataType[]) => [
                                  ...prev.filter(
                                    value =>
                                      problemList.findIndex(
                                        val => val.key === value.key
                                      ) === -1
                                  )
                                ]
                              )
                        }
                      },
                      onSelect: (record, selected) => {
                        selected
                          ? setSelectedProblems(
                              (prev: IPrblemTableDataType[]) => [
                                ...prev,
                                record
                              ]
                            )
                          : setSelectedProblems(
                              (prev: IPrblemTableDataType[]) => [
                                ...prev.filter(
                                  value => value.key !== record.key
                                )
                              ]
                            )
                      }
                    }
                  : undefined
              }
              size="small"
              pagination={{
                position: ['bottomCenter'],
                current: pageNum.current,
                pageSize: pageSize.current,
                total: total,
                showQuickJumper: true,
                hideOnSinglePage: true,
                onShowSizeChange: (current, size) => {
                  pageNum.current = current
                  pageSize.current = size
                },
                onChange: handlePageChange
              }}
              dataSource={problemList}
            >
              {/* <Column  title="序号" dataIndex={'index'}></Column> */}
              <Column
                title="KEY"
                dataIndex={'key'}
                width={128}
                render={value => (
                  <Tooltip
                    mouseEnterDelay={0.3}
                    title={`点击复制${value}`}
                    color="white"
                    overlayInnerStyle={{
                      color: 'black'
                    }}
                  >
                    <div
                      className="select-none hover:cursor-pointer"
                      onClick={() => handleKyeClick(value)}
                    >
                      <div
                        className="w-16"
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  </Tooltip>
                )}
              ></Column>
              <Column
                title="标题"
                dataIndex={'title'}
                render={(value, _, index) => (
                  <Popover
                    mouseEnterDelay={0.3}
                    title={value}
                    content={
                      <ReadOnly
                        html={problemList[index].description}
                      ></ReadOnly>
                    }
                    overlayStyle={{
                      maxWidth: '512px'
                    }}
                    overlayInnerStyle={{
                      maxHeight: '256px',
                      overflow: 'scroll'
                    }}
                  >
                    <div
                      className="hover:cursor-pointer text-indigo-500 min-w-max"
                      onClick={() => toDetail(index)}
                    >
                      {value}
                    </div>
                  </Popover>
                )}
              ></Column>

              <Column
                title="标签"
                dataIndex={'labels'}
                render={value => (
                  <>
                    {value.map((item: any, index: number) => {
                      return (
                        <Tag key={index} bordered={false} color="#f1f5f9">
                          <div className="text-slate-700">{item.label}</div>
                        </Tag>
                      )
                    })}
                  </>
                )}
              ></Column>
              <Column
                title="AC率"
                dataIndex={'acPerc'}
                width={128}
                render={value => <div className="">{value}</div>}
              ></Column>
            </Table>
          )}
        </div>
      </div>
    </>
  )
}

export default ProblemList
