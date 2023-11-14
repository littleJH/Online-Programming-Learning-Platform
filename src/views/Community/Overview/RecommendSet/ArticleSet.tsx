import { getArticleListApi } from '@/api/article'
import ArticleCard from '@/components/card/ArticleCard'
import { IArticle } from '@/type'
import React, { useEffect, useState, useRef } from 'react'
import { currentArticleState } from '@/store/appStore'
import { useSetRecoilState } from 'recoil'
import { Skeleton } from 'antd'
import useNavTo from '@/tool/myHooks/useNavTo'
import useListenContentScroll from '@/tool/myHooks/useListenScroll'
import Loading from '@/components/Loading/Loading'
import LoadMoreList from '@/components/List/LoadMoreList'

const ArticleSet: React.FC = () => {
  const [articleList, setarticleList] = useState<IArticle[]>()
  const [loading, setLoading] = useState(false)
  const setcurrentArticle = useSetRecoilState(currentArticleState)
  const pageNum = useRef<number>(1)
  const pageSize = useRef<number>(10)
  const nav = useNavTo()

  useEffect(() => {
    fetch()
  }, [])

  useListenContentScroll({ loadMoreFn: () => fetch() })

  const fetch = () => {
    setLoading(true)
    getArticleListApi(pageNum.current, pageSize.current).then((res) => {
      console.log('fetchArticles...')
      setarticleList((value) => (value ? [...value, ...res.data.data.articles] : res.data.data.articles))
      setLoading(false)
    })
    pageNum.current++
  }

  const handleCardClick = (article: IArticle) => {
    setcurrentArticle(article)
    nav(`/community/article/${article.id}`)
  }

  return (
    <div style={{ width: '820px' }}>
      {/* {!articleList && (
        <Skeleton
          active
          paragraph={{ rows: 9 }}
        ></Skeleton>
      )}
      {articleList &&
        articleList.map((article) => (
          <ArticleCard
            articleProp={article}
            key={article.id}
            onclick={handleCardClick}
          ></ArticleCard>
        ))}
      {loading && articleList && <Loading></Loading>} */}
      <LoadMoreList
        dataSource={articleList}
        fetchFn={fetch}
        loading={loading}
        split={false}
        itemRender={(item: IArticle) => (
          <ArticleCard
            articleProp={item}
            key={item.id}
            onclick={handleCardClick}
          ></ArticleCard>
        )}
      ></LoadMoreList>
    </div>
  )
}

export default ArticleSet
