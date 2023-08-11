import { getArticleListApi } from '@/api/article'
import ArticleCard from '@/components/Card/ArticleCard'
import { IArticle } from '@/vite-env'
import React, { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { currentArticleState } from '@/Recoil/store'
import { useSetRecoilState } from 'recoil'
import { Skeleton } from 'antd'

const ArticleSet: React.FC = () => {
  const [articleList, setarticleList] = useState<IArticle[]>([])
  const [setactiveKey] = useOutletContext<[Function]>()
  const setcurrentArticle = useSetRecoilState(currentArticleState)
  const nav = useNavigate()

  useEffect(() => {
    getArticleListApi().then(res => {
      setarticleList(res.data.data.articles)
      // return res.data.data.articles
    })
    // .then(async (articles: IArticle[]) => {
    //   let index = 0
    //   for (let article of articles) {
    //     const res = await Promise.all([
    //       getUserInfoApi(article.user_id),
    //       getArticleLikedApi(article.id),
    //       getArticleLikeNumApi(article.id, 'true'),
    //       getArticleCollectedApi(article.id),
    //       getArticleCollectNumApi(article.id),
    //       getArticleVisibleNumApi(article.id),
    //       getArticleLabelsApi(article.id),
    //       getArticleRemarkListApi(article.id)
    //     ])
    //     articles[index].user = res[0].data.data.user
    //     articles[index].liked = res[1].data.data.like
    //     articles[index].likeNum = res[2].data.data.total
    //     articles[index].collected = res[3].data.data.collect
    //     articles[index].collectNum = res[4].data.data.total
    //     articles[index].visibleNum = res[5].data.data.total
    //     articles[index].labels = res[6].data.data.articleLabels
    //     articles[index].remark = {
    //       remarks: res[7].data.data.remarks,
    //       total: res[7].data.data.total
    //     }
    //     index++
    //   }
    //   setarticleList(articles)
    //   console.log(articles)
    // })
  }, [])

  const handleCardClick = (article: IArticle) => {
    setcurrentArticle(article)
    nav(`/community/article/${article.id}`)
    setactiveKey(`article/${article.id}`)
  }

  return (
    <div className="w-full">
      {!articleList.length && (
        <Skeleton active paragraph={{ rows: 9 }}></Skeleton>
      )}
      {articleList.length &&
        articleList.map(article => (
          <ArticleCard
            articleProp={article}
            key={article.id}
            onclick={handleCardClick}
          ></ArticleCard>
        ))}
    </div>
  )
}

export default ArticleSet
