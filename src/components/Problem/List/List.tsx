import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  getProblemLabelsApi,
  getProblemListApi,
  searchProblemByLabelApi,
  searchProblemByTextAndLabelApi,
  searchProblemByTextApi,
  showProblemApi,
} from '@/api/problem'
import {
  Avatar,
  Collapse,
  Descriptions,
  Input,
  Popover,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  Tooltip,
  notification,
} from 'antd'
import { getRecordListApi } from '@/api/record'
import Column from 'antd/es/table/Column'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import AcPercentLabel from '@/components/Label/ProblemLabel/AcPercentLabel'
import { IPrblemTableDataType, IProblem, ITopic } from '@/type'
import { getTagListApi } from '@/api/tag'
import ReadOnly from '@/components/editor/Readonly'
import {
  getTopicApi,
  getTopicListApi,
  getTopicProblemsApi,
  searchProblemInTopicByLabelApi,
  searchProblemInTopicByTextApi,
  searchProblemInTopicByTextLabelApi,
} from '@/api/topic'
import { getUserInfoApi } from '@/api/user'
import { iconBaseUrl } from '@/config/apiConfig'
import ProblemTable from '../table/ProblemTable'
import useNavTo from '@/tool/myHooks/useNavTo'
import MyTag from '@/components/Label/MyTag'
import MyCollapse from '@/components/Collapse/MyCollapse'

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
const setFirst = (bool: boolean) => {
  first = bool
}

const ProblemList: React.FC<IProps> = (props) => {
  const { mode, width, setSelectedProblems, selectedRowKeys } = props
  const nav = useNavTo()
  const { Search } = Input
  const [querys, setQuerys] = useSearchParams()
  const [topic_id, setTopic_id] = useState(querys.get('topic') || '')
  const [searchText, setSearchText] = useState<string>(querys.get('text') || '')
  const [labelGroup, setLabelGroup] = useState<string[]>(JSON.parse(querys.get('labels') || '[]'))
  const [pageNum, setPageNum] = useState<number>(Number(querys.get('pageNum') || 1))
  const [pageSize, setPageSize] = useState(Number(querys.get('pageSize') || 20))
  const [total, setTotal] = useState(0)
  const [problemList, setproblemList] = useState<IProblem[]>([])
  const [topicList, setTopicList] = useState<ITopic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<ITopic | undefined>()
  const [tagList, setTagList] = useState<ITag[]>([])
  const [fetchDone, setFetchDone] = useState(false)
  const leftCtn = useRef<HTMLDivElement>(null)
  const searchCtn = useRef<HTMLDivElement>(null)
  const [tableScrollHeight, setTableScrollHeight] = useState(0)
  const [collapseActiveKey, setCollapseActiveKey] = useState([topic_id])

  useEffect(() => {
    if (!topic_id && !searchText.length && !labelGroup.length) {
      initProblemList(1)
    } else {
      if (!searchText.length && !labelGroup.length && topic_id) fetchTopics(topic_id)
      else if (searchText.length) searchProblemByText()
      else if (labelGroup.length) searchProblemsByLabels(1)
    }
    if (topic_id) {
      getTopicApi(topic_id).then((res) => {
        setSelectedTopic(res.data.data.topic)
      })
    }
    getTopicListApi().then((res) => {
      const topics = res.data.data.topics
      setTopicList(topics)
    })
    getTagListApi(1, 10000).then((res) => {
      const list: ITag[] = []
      const tags = res.data.data.tags
      tags.forEach((item: any) =>
        list.push({
          label: item.tag,
          checked: labelGroup.find((value) => value === item.tag) ? true : false,
        })
      )
      setTagList(list)
    })
  }, [])

  useEffect(() => {
    fetchDone &&
      document.querySelector('#content')?.scrollTo({
        left: 0,
        top: 0,
      })
  }, [fetchDone])

  useEffect(() => {
    if (first) return
    const list: string[] = []
    tagList.forEach((item) => {
      item.checked ? list.push(item.label) : null
    })
    setLabelGroup(list)
  }, [tagList])

  const topicOptions = useMemo(() => {
    const list: TopicOptionType[] = []
    topicList.forEach((topic) =>
      list.push({
        value: topic.id,
        label: topic.title,
      })
    )
    return list
  }, [topicList])

  // 监听topic_id
  useEffect(() => {
    if (first) return
    resetPage()
    if (!labelGroup.length && !searchText.length) {
      topic_id ? fetchTopics(topic_id) : initProblemList(2)
    } else if (labelGroup.length) searchProblemsByLabels(2)
    else if (searchText.length) searchProblemByText()
    else searchProblemByTextAndLabel()
    setCollapseActiveKey([topic_id])
  }, [topic_id])

  // 监听serachText清空
  useEffect(() => {
    if (first) return
    resetPage()
    if (!searchText.length)
      if (!labelGroup.length && !topic_id) initProblemList(3)
      else if (labelGroup.length) searchProblemsByLabels(3)
      else if (topic_id) fetchTopics(topic_id)
  }, [searchText])

  // 监听labelGroup
  useEffect(() => {
    setQuerys((search) => {
      search.set('labels', JSON.stringify(labelGroup))
      return search
    })
    if (first) return
    resetPage()
    if (labelGroup.length) {
      searchText.length ? searchProblemByTextAndLabel() : searchProblemsByLabels(4)
    } else {
      if (!searchText.length && !topic_id) initProblemList(4)
      else if (searchText.length) searchProblemByText()
      else if (topic_id) fetchTopics(topic_id)
    }
  }, [labelGroup])

  // 监听pageNum, pageSize
  useEffect(() => {
    setQuerys((search) => {
      search.set('pageNum', String(pageNum))
      search.set('pageSize', String(pageSize))
      return search
    })
    if (!topic_id && !searchText.length && !labelGroup.length) {
      initProblemList(5)
    } else {
      if (searchText.length && labelGroup.length) searchProblemByTextAndLabel()
      else if (searchText.length) searchProblemByText()
      else if (labelGroup.length) searchProblemsByLabels(5)
      else fetchTopics(topic_id)
    }
  }, [pageNum, pageSize])

  const initProblemList = (index: number) => {
    setFetchDone(false)
    // console.log('initProblemList', index)
    getProblemListApi(pageNum, pageSize).then((problemsRes) => {
      // console.log(problemsRes.data.data)
      setTotal(problemsRes.data.data.total)
      setproblemList(problemsRes.data.data.problems)
    })
  }

  const fetchTopics = async (topic_id: string) => {
    setFetchDone(false)
    const res = await getTopicProblemsApi(topic_id)
    const list = res.data.data.problemLists
    setTotal(list.length)
    const problems: IProblem[] = []
    for (let index = 0; index < list.length; index++) {
      const res = await showProblemApi(list[index].problem_id)
      problems.push(res.data.data.problem)
    }
    setproblemList(problems)
  }

  const toDetail = (record: any) => {
    const id = record.key
    nav(`/problemdetail/${id}/description`)
  }

  const searchProblemByText = () => {
    setFetchDone(false)
    if (topic_id) {
      searchProblemInTopicByTextApi(topic_id, searchText, pageNum, pageSize).then((res) => {
        // console.log(res.data)
        setTotal(res.data.data.total)
        setproblemList(res.data.data.problems)
      })
    } else {
      searchProblemByTextApi(searchText, pageNum, pageSize).then((res) => {
        // console.log(res.data)
        setTotal(res.data.data.total)
        setproblemList(res.data.data.problems)
      })
    }
  }

  const searchProblemsByLabels = (index: number) => {
    // console.log('searchProblemsByLabels', index, first)
    setFetchDone(false)
    if (topic_id) {
      searchProblemInTopicByLabelApi(topic_id, labelGroup, pageNum, pageSize).then((res) => {
        // console.log(res.data.data)
        setTotal(res.data.data.total)
        setproblemList(res.data.data.problems)
      })
    } else {
      searchProblemByLabelApi(labelGroup, pageNum, pageSize).then((res) => {
        // console.log(res.data.data)
        setTotal(res.data.data.total)
        setproblemList(res.data.data.problems)
      })
    }
  }

  const searchProblemByTextAndLabel = () => {
    setFetchDone(false)
    if (topic_id) {
      searchProblemInTopicByTextLabelApi(topic_id, searchText, labelGroup, pageNum, pageSize).then((res) => {
        // console.log(res.data)
        setTotal(res.data.data.total)
        // console.log(res.data)
        setproblemList(res.data.data.problems)
      })
    } else {
      searchProblemByTextAndLabelApi(searchText, labelGroup, pageNum, pageSize).then((res) => {
        // console.log(res.data)
        setTotal(res.data.data.total)
      })
    }
  }

  const handleTopicChange = async (value: string) => {
    const topic = topicList.find((topic) => topic.id === value)
    if (topic) {
      const res = await getUserInfoApi(topic.user_id)
      topic.user = res.data.data.user
    }
    resetPage()
    setTopic_id(topic?.id || '')
    setSelectedTopic(topic)
    setQuerys((search) => {
      search.set('topic', topic?.id || '')
      return search
    })
  }

  const handleSearch = () => {
    if (!searchText.length) return
    resetPage()
    if (!labelGroup.length) {
      searchProblemByText()
    } else {
      searchProblemByTextAndLabel()
    }
  }

  const handleTagClick = (index: number) => {
    const list = [...tagList]
    list[index].checked = !list[index].checked
    setTagList(list)
  }

  const handleDeselect = (value: string) => {
    const list = [...tagList]
    const index = tagList.findIndex((item) => item.label === value)
    list[index].checked = false
    setTagList(list)
  }

  const handleClear = () => {
    const list = [...tagList]
    list.forEach((item) => (item.checked = false))
    setTagList(list)
  }

  const handleTextChange = (event: any) => {
    setSearchText(event.target.value)
    setQuerys((search) => {
      search.set('text', event.target.value)
      return search
    })
  }

  const handlePageChange = (num: number, size: number) => {
    setPageNum(num)
    setPageSize(size)
  }

  const resetPage = () => {
    setPageNum(1)
  }

  const handleCollapseChange = (keys: any) => {
    setCollapseActiveKey((value) => (value.length ? [] : keys))
  }

  return (
    <>
      <div
        className="flex h-full"
        style={{
          width: `${width}px`,
          maxWidth: '1024px',
        }}
      >
        <div ref={leftCtn} className="grow w-full" style={{ width: '1px' }}>
          <div ref={searchCtn} className="py-4 w-full flex">
            <div style={{ flexGrow: '1', width: '1/3' }}>
              <Select
                style={{
                  width: '100%',
                }}
                allowClear
                placeholder="选择题单"
                value={selectedTopic?.id}
                onChange={handleTopicChange}
                options={topicOptions}
              ></Select>
            </div>
            <div className="w-4"></div>
            <div style={{ flexGrow: '1', width: '1/3' }}>
              <Popover
                overlayStyle={{
                  maxWidth: '800px',
                }}
                trigger={'click'}
                content={
                  <div>
                    {tagList.map((item: ITag, index) => (
                      // <Tag
                      //   key={index}
                      //   style={{
                      //     margin: '0.5rem 0.25rem'
                      //   }}
                      //   color={`${item.checked ? '#6366f1' : '#f1f5f9'}`}
                      // >
                      //   <div
                      //     className={`hover:cursor-pointer select-none ${item.checked ? 'text-white' : 'text-slate-700'}`}
                      //     onClick={() => handleTagClick(index)}
                      //   >
                      //     {item.label}
                      //   </div>
                      // </Tag>
                      <span
                        key={index}
                        onClick={() => handleTagClick(index)}
                        style={{
                          marginBottom: '0.5rem',
                        }}
                      >
                        <MyTag checkable checked={tagList[index].checked}>
                          {item.label}
                        </MyTag>
                      </span>
                    ))}
                  </div>
                }
              >
                <Select
                  mode="multiple"
                  showSearch={false}
                  style={{ width: '100%' }}
                  allowClear
                  maxTagCount={3}
                  placeholder="标签筛选"
                  open={false}
                  value={labelGroup}
                  onDeselect={handleDeselect}
                  onClear={handleClear}
                ></Select>
              </Popover>
            </div>
            <div className="w-4"></div>
            <div style={{ flexGrow: '1', width: '1/3' }}>
              <Search
                style={{
                  width: '100%',
                }}
                defaultValue={searchText}
                placeholder="文本搜索"
                enterButton
                onSearch={handleSearch}
                onChange={handleTextChange}
              ></Search>
            </div>
          </div>
          {selectedTopic && (
            <MyCollapse
              activeKey={collapseActiveKey}
              onChange={handleCollapseChange}
              style={{
                margin: '0 0 1rem 0',
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
                            <Avatar src={`${iconBaseUrl}/${selectedTopic.user?.icon}`}></Avatar>
                            <NavLink to={''} className={'text-indigo-500 hover:text-indigo-500'}>
                              {selectedTopic.user?.name}
                            </NavLink>
                          </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label={'创建时间'}>{selectedTopic.created_at}</Descriptions.Item>
                        <Descriptions.Item label={'题目总数'}>{total}</Descriptions.Item>
                        {selectedTopic.content !== '' && (
                          <Descriptions.Item label="题单描述">
                            <ReadOnly html={selectedTopic.content}></ReadOnly>
                          </Descriptions.Item>
                        )}
                      </Descriptions>
                    </>
                  ),
                },
              ]}
            ></MyCollapse>
          )}
          <ProblemTable
            mode={mode}
            problemList={problemList}
            pageNum={pageNum}
            pageSize={pageSize}
            setPageNum={setPageNum}
            setPageSize={setPageSize}
            total={total}
            fetchDone={fetchDone}
            setFetchDone={setFetchDone}
            setFirst={setFirst}
            onPageChange={handlePageChange}
            onLineClick={toDetail}
            tableScrollHeight={tableScrollHeight}
            setSelectedProblems={setSelectedProblems}
            selectedRowKeys={selectedRowKeys}
          ></ProblemTable>
        </div>
      </div>
    </>
  )
}

export default ProblemList
