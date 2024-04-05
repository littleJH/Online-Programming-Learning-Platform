import { getArticleListApi, searchArticlesApi } from '@/api/article'
import ArticleCard from '@/components/card/ArticleCard'
import { IArticle } from '@/type'
import React, { useCallback, useEffect, useState } from 'react'
import { currentArticleState } from '@/store/appStore'
import { useSetRecoilState } from 'recoil'
import LoadMoreList from '@/components/List/LoadMoreList'
import myHooks from '@/tool/myHooks/myHooks'
import style from '../../style.module.scss'
import { useSearchParams } from 'react-router-dom'

const ArticleSet: React.FC = () => {
  const [querys] = useSearchParams()
  const [text, setText] = useState(querys.get('text') || '')
  const [articleList, setarticleList] = useState<IArticle[]>()
  const [total, setTotal] = useState(0)
  const setcurrentArticle = useSetRecoilState(currentArticleState)
  const nav = myHooks.useNavTo()

  useEffect(() => console.log('search text ==> ', text), [text])

  const fetchArticles = async (pageNum: number, pageSize: number, callback: Function) => {
    console.log('fetchArticles...')
    const res = await getArticleListApi(pageNum, pageSize)
    if (res.data.code === 200) {
      setarticleList((value) => (value ? [...value, ...res.data.data.articles] : res.data.data.articles))
      setTotal(res.data.data.total)
      callback()
    }
  }

  const searchArticles = async (pageNum: number, pageSize: number, callback: Function) => {
    const res = await searchArticlesApi(text, pageNum, pageSize)
    console.log('searchArticles...')
  }

  const handleCardClick = (article: IArticle) => {
    setcurrentArticle(article)
    nav(`/community/article/${article.id}`)
  }

  return (
    <div className={style.articleSet}>
      <LoadMoreList
        dataSource={articleList}
        total={total}
        fetchFn={fetchArticles}
        split={false}
        itemRender={(item: IArticle) => (
          <ArticleCard articleProp={item} key={item.id} onclick={handleCardClick}></ArticleCard>
        )}
      ></LoadMoreList>
    </div>
  )
}

export default ArticleSet
