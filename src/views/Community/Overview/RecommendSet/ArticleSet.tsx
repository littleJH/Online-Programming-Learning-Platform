import {
  getArticleCollectNumApi,
  getArticleCollectedApi,
  getArticleLabelsApi,
  getArticleLikeNumApi,
  getArticleLikedApi,
  getArticleListApi,
  getArticleVisibleNumApi
} from '@/api/article'
import { getArticleRemarkListApi } from '@/api/remark'
import { getUserInfoApi } from '@/api/user'
import ArticleCard from '@/components/Card/ArticleCard'
import { IArticle } from '@/vite-env'
import React, { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { currentArticleState } from '@/Recoil/store'
import { useSetRecoilState } from 'recoil'
import { Skeleton } from 'antd'

const ArticleSet: React.FC = () => {
  const [articleList, setarticleList] = useState<IArticle[]>()
  const [setactiveKey] = useOutletContext<[Function]>()
  const setcurrentArticle = useSetRecoilState(currentArticleState)
  const nav = useNavigate()

  useEffect(() => {
    getArticleListApi()
      .then(res => {
        return res.data.data.articles
      })
      .then(async (articles: IArticle[]) => {
        let index = 0
        for (let article of articles) {
          const res = await Promise.all([
            getUserInfoApi(article.user_id),
            getArticleLikedApi(article.id),
            getArticleLikeNumApi(article.id, 'true'),
            getArticleCollectedApi(article.id),
            getArticleCollectNumApi(article.id),
            getArticleVisibleNumApi(article.id),
            getArticleLabelsApi(article.id),
            getArticleRemarkListApi(article.id)
          ])
          articles[index].user = res[0].data.data.user
          articles[index].liked = res[1].data.data.like
          articles[index].likeNum = res[2].data.data.total
          articles[index].collected = res[3].data.data.collect
          articles[index].collectNum = res[4].data.data.total
          articles[index].visibleNum = res[5].data.data.total
          articles[index].labels = res[6].data.data.articleLabels
          articles[index].remark = {
            remarks: res[7].data.data.remarks,
            total: res[7].data.data.total
          }
          index++
        }
        setarticleList(articles)
        console.log(articles)
      })
  }, [])

  const handleCardClick = (id: string) => {
    if (articleList)
      setcurrentArticle(
        articleList[articleList?.findIndex(article => article.id === id)]
      )
    else return

    nav(`/community/article/${id}`)
    setactiveKey(`article/${id}`)
  }

  return (
    <div className="w-full">
      {!articleList && <Skeleton active paragraph={{ rows: 9 }}></Skeleton>}
      {articleList?.map(article => (
        <ArticleCard
          article={article}
          key={article.id}
          onclick={handleCardClick}
        ></ArticleCard>
      ))}
    </div>
  )
}

export default ArticleSet
