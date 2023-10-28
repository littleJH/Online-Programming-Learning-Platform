import React, { useEffect, useState } from 'react'
import ArticleCard from '@/components/Card/ArticleCard'
import { IArticle } from '@/type'
import { getArticleListApi } from '@/api/article'
import { useSetRecoilState } from 'recoil'
import { currentArticleState } from '@/store/appStore'
import { useNavigate } from 'react-router-dom'

const Article: React.FC = () => {
  const nav = useNavigate()
  const [articleList, setArticleList] = useState<IArticle[]>([])
  const setcurrentArticle = useSetRecoilState(currentArticleState)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  useEffect(() => {
    getArticleListApi(pageNum, pageSize).then(res => {
      setArticleList(res.data.data.articles)
    })
  }, [])

  const handleArticleClick = (article: IArticle) => {
    setcurrentArticle(article)
    nav(`/community/article/${article.id}`)
  }

  return (
    <div>
      {articleList.map(article => (
        <ArticleCard
          key={article.id}
          articleProp={article}
          onclick={handleArticleClick}
        ></ArticleCard>
      ))}
    </div>
  )
}

export default Article
