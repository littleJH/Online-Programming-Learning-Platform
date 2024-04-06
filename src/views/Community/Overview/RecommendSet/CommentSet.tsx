import ArticleCard from '@/components/card/ArticleCard'
import React, { useMemo, useState } from 'react'
import { currentArticleState, searchQueryState } from '@/store/appStore'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import LoadMoreList from '@/components/List/LoadMoreList'
import myHooks from '@/tool/myHooks/myHooks'
import style from '../../style.module.scss'
import utils from '@/tool/myUtils/utils'
import { IComment } from '@/type'
import { getCommentHotRankApi, getCommentListApi } from '@/api/comment'
import { getProblemHotRankApi } from '@/api/problem'
import CommentCard from '@/components/Card/CommentCard'

const Element: React.FC = () => {
  const searchQuerys = useRecoilValue(searchQueryState)
  const [articleList, setarticleList] = useState<IComment[]>([])
  const [total, setTotal] = useState(0)
  const setcurrentArticle = useSetRecoilState(currentArticleState)
  const nav = myHooks.useNavTo()

  const fetchFn = useMemo(() => {
    setarticleList([])
    return async (pageNum: number, pageSize: number, callback: Function) => {
      const text = utils.getQuerys(searchQuerys)?.text
      try {
        // let data, total, code
        // if(text) {}
        // else {
        //   const problems = (await getProblemHotRankApi(pageNum, pageSize)).data.data.problems
        // }
        // if (code === 200) {
        //   setarticleList((value) => (value ? [...value, ...res.data.data.articles] : res.data.data.articles))
        //   setTotal(res.data.data.total)
        //   callback()
        // }
      } catch {}
    }
  }, [searchQuerys])

  const handleCardClick = (comment: IComment) => {
    // setcurrentArticle(comment)
    // nav(`/community/article/${comment.id}`)
  }

  return (
    <div className={style.articleSet}>
      <LoadMoreList
        dataSource={articleList}
        total={total}
        fetchFn={fetchFn}
        split={false}
        itemRender={(item: IComment) => <CommentCard></CommentCard>}
      ></LoadMoreList>
    </div>
  )
}

export default Element
