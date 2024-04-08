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
import { getUserInfoApi } from '@/api/user'

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

  const fetch = async () => {
    setLoading(true)
    setTopicList([])
    try {
      const data = (await getTopicListApi(pageNum, pageSize)).data.data
      const list: ITopic[] = []
      for (let topic of data.topics) {
        list.push({
          ...topic,
          user: (await getUserInfoApi(topic.user_id)).data.data.user,
        })
      }
      setTopicList(list)
      setTotal(data.total)
      setLoading(false)
    } catch {}
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
