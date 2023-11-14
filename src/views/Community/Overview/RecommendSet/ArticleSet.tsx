import { getArticleListApi } from '@/api/article'
import ArticleCard from '@/components/card/ArticleCard'
import { IArticle } from '@/type'
import React, { useState } from 'react'
import { currentArticleState } from '@/store/appStore'
import { useSetRecoilState } from 'recoil'
import useNavTo from '@/tool/myHooks/useNavTo'
import LoadMoreList from '@/components/List/LoadMoreList'

const ArticleSet: React.FC = () => {
  const [articleList, setarticleList] = useState<IArticle[]>()
  const setcurrentArticle = useSetRecoilState(currentArticleState)
  const nav = useNavTo()

  const fetch = (pageNum: number, pageSize: number, setLoading: Function, callback: Function) => {
    setLoading(true)
    getArticleListApi(pageNum, pageSize).then((res) => {
      console.log('fetchArticles...')
      setarticleList((value) => (value ? [...value, ...res.data.data.articles] : res.data.data.articles))
      setLoading(false)
    })
    callback()
  }

  const handleCardClick = (article: IArticle) => {
    setcurrentArticle(article)
    nav(`/community/article/${article.id}`)
  }

  return (
    <div style={{ width: '820px' }}>
      <LoadMoreList
        dataSource={articleList}
        fetchFn={fetch}
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
