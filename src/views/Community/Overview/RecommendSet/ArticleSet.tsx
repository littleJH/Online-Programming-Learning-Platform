import { getArticleListApi } from '@/api/article'
import ArticleCard from '@/components/card/ArticleCard'
import { IArticle } from '@/type'
import React, { useState } from 'react'
import { currentArticleState } from '@/store/appStore'
import { useSetRecoilState } from 'recoil'
import LoadMoreList from '@/components/List/LoadMoreList'
import myHooks from '@/tool/myHooks/myHooks'

const ArticleSet: React.FC = () => {
  const [articleList, setarticleList] = useState<IArticle[]>()
  const [total, setTotal] = useState(0)
  const setcurrentArticle = useSetRecoilState(currentArticleState)
  const nav = myHooks.useNavTo()

  const fetch = async (pageNum: number, pageSize: number, callback: Function) => {
    const res = await getArticleListApi(pageNum, pageSize)
    if (res.data.code === 200) {
      console.log('fetchArticles...')
      setarticleList((value) => (value ? [...value, ...res.data.data.articles] : res.data.data.articles))
      setTotal(res.data.data.total)
      callback()
    }
  }

  const handleCardClick = (article: IArticle) => {
    setcurrentArticle(article)
    nav(`/community/article/${article.id}`)
  }

  return (
    <div style={{ width: '820px' }}>
      <LoadMoreList
        dataSource={articleList}
        total={total}
        fetchFn={fetch}
        split={false}
        itemRender={(item: IArticle) => (
          <ArticleCard articleProp={item} key={item.id} onclick={handleCardClick}></ArticleCard>
        )}
      ></LoadMoreList>
    </div>
  )
}

export default ArticleSet
