import { getArticleListApi } from '@/api/article'
import ArticleCard from '@/components/card/ArticleCard'
import { IArticle } from '@/type'
import React, { useEffect, useState } from 'react'
import { currentArticleState } from '@/store/appStore'
import { useSetRecoilState } from 'recoil'
import { Skeleton } from 'antd'
import useNavTo from '@/tool/myHooks/useNavTo'

const ArticleSet: React.FC = () => {
  const [articleList, setarticleList] = useState<IArticle[]>([])
  const setcurrentArticle = useSetRecoilState(currentArticleState)
  const nav = useNavTo()

  useEffect(() => {
    getArticleListApi().then((res) => {
      setarticleList(res.data.data.articles)
    })
  }, [])

  const handleCardClick = (article: IArticle) => {
    setcurrentArticle(article)
    nav(`/community/article/${article.id}`)
  }

  return (
    <div style={{ width: '820px' }}>
      {!articleList.length && (
        <Skeleton
          active
          paragraph={{ rows: 9 }}
        ></Skeleton>
      )}
      {articleList.length &&
        articleList.map((article) => (
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
