import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { notificationApi } from '@/store/appStore'
import { ITopic } from '@/type'
import { deleteTopicApi, getTopicListApi, getTopicProblemsApi } from '@/api/topic'
import PaginationList from '@/components/List/PaginationList'
import TopicCollapse from '@/components/topic/TopicCollapse'
import myHooks from '@/tool/myHooks/myHooks'
import style from '../style.module.scss'

const Topic: React.FC = () => {
  const [querys, setQuerys] = useSearchParams()
  const [topicList, setTopicList] = useState<ITopic[]>([])
  const [pageNum, setPageNum] = useState(Number(querys.get('pageNum')) || 1)
  const [pageSize, setPageSize] = useState(Number(querys.get('pageSize')) || 10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setQuerys((search) => {
      search.set('pageNum', String(pageNum))
      search.set('pageSize', String(pageSize))
      return search
    })
    fetch()
  }, [pageNum, pageSize])

  const fetch = () => {
    setLoading(true)
    setTopicList([])
    getTopicListApi(pageNum, pageSize).then((res) => {
      setTopicList(res.data.data.topics)
      setTotal(res.data.data.total)
      setLoading(false)
    })
  }

  const handlePageChange = (num: number, size: number) => {
    setPageNum(num)
    setPageSize(size)
  }

  return (
    <div className={style.listCtn}>
      <PaginationList
        dataSource={topicList}
        loading={loading}
        pageNum={pageNum}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
        split={false}
        itemRender={(item: ITopic, index: number) => (
          <div className="w-full">
            <TopicCollapse topic={item} index={index} total={total}></TopicCollapse>
          </div>
        )}
      ></PaginationList>
    </div>
  )
}

export default Topic
