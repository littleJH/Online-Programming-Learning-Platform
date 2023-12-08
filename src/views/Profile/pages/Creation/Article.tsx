import React, { useEffect, useState } from 'react'
import ArticleCard from '@/components/card/ArticleCard'
import { IArticle } from '@/type'
import { deleteArticleApi, getArticleListApi } from '@/api/article'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { currentArticleState, notificationApi } from '@/store/appStore'
import useNavTo from '@/tool/myHooks/useNavTo'
import PaginationList from '@/components/List/PaginationList'
import { useSearchParams } from 'react-router-dom'

const Article: React.FC = () => {
  const nav = useNavTo()
  const [querys, setQuerys] = useSearchParams()
  const notification = useRecoilValue(notificationApi)
  const [articleList, setArticleList] = useState<IArticle[]>([])
  const [pageNum, setPageNum] = useState(Number(querys.get('pageNum')) || 1)
  const [pageSize, setPageSize] = useState(Number(querys.get('pageSize')) || 10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setQuerys(search => {
      search.set('pageNum', String(pageNum))
      search.set('pageSize', String(pageSize))
      return search
    })
    fetchPorblems()
  }, [pageNum, pageSize])

  const fetchPorblems = () => {
    setLoading(true)
    setArticleList([])
    getArticleListApi(pageNum, pageSize).then(res => {
      setArticleList(res.data.data.articles)
      setTotal(res.data.data.total)
      setLoading(false)
    })
  }

  const handleDetail = (item: IArticle) => {
    nav(`/community/article/${item.id}`)
  }
  const handleUpdate = (item: IArticle) => {
    nav(`/creation/article?article_id=${item.id}`)
  }
  const handleDelete = async (item: IArticle, index: number) => {
    const { data } = await deleteArticleApi(item.id)
    if (data.code === 200) {
      notification &&
        notification.success({
          message: `文章“${item.title}”已删除`,
        })
      setArticleList(value => [
        ...value.slice(0, index),
        ...value.slice(index + 1),
      ])
    }
  }
  const handlePageChange = (num: number, size: number) => {
    setPageNum(num)
    setPageSize(size)
  }

  return (
    <div>
      <PaginationList
        dataSource={articleList}
        loading={loading}
        onDelete={handleDelete}
        onDetail={handleDetail}
        onUpdate={handleUpdate}
        pageNum={pageNum}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
        itemRender={(item: IArticle) => (
          <div className="w-full">
            <ArticleCard
              key={item.id}
              articleProp={item}
              mode="action"
            ></ArticleCard>
          </div>
        )}
      ></PaginationList>
    </div>
  )
}

export default Article
