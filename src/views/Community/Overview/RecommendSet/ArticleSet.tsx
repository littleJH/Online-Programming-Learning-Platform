import { getArticleListApi, searchArticlesApi } from '@/api/article'
import ArticleCard from '@/components/card/ArticleCard'
import { IArticle } from '@/type'
import React, { useMemo, useState } from 'react'
import { currentArticleState, searchQueryState } from '@/store/appStore'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import LoadMoreList from '@/components/List/LoadMoreList'
import myHooks from '@/tool/myHooks/myHooks'
import style from '../../style.module.scss'
import utils from '@/tool/myUtils/utils'

const ArticleSet: React.FC = () => {
  const searchQuerys = useRecoilValue(searchQueryState)
  const [articleList, setarticleList] = useState<IArticle[]>([])
  const [total, setTotal] = useState(0)
  const setcurrentArticle = useSetRecoilState(currentArticleState)
  const nav = myHooks.useNavTo()

  const fetchFn = useMemo(() => {
    setarticleList([])
    return async (pageNum: number, pageSize: number, callback: Function) => {
      const text = utils.getQuerys(searchQuerys)?.text
      try {
        const res = text ? await searchArticlesApi(text, pageNum, pageSize) : await getArticleListApi(pageNum, pageSize)
        if (res.data.code === 200) {
          setarticleList((value) => (value ? [...value, ...res.data.data.articles] : res.data.data.articles))
          setTotal(res.data.data.total)
          callback()
        }
      } catch {}
    }
  }, [searchQuerys])

  const handleCardClick = (article: IArticle) => {
    setcurrentArticle(article)
    nav(`/community/article/${article.id}`)
  }

  return (
    <div className={style.articleSet}>
      <LoadMoreList
        dataSource={articleList}
        total={total}
        fetchFn={fetchFn}
        split={false}
        itemRender={(item: IArticle) => <ArticleCard articleProp={item} onclick={handleCardClick}></ArticleCard>}
      ></LoadMoreList>
    </div>
  )
}

export default ArticleSet
