import ArticleCard from '@/components/card/ArticleCard'
import React, { useMemo, useState } from 'react'
import { currentArticleState, pathNameState, searchQueryState } from '@/store/appStore'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import LoadMoreList from '@/components/List/LoadMoreList'
import myHooks from '@/tool/myHooks/myHooks'
import style from '../style.module.scss'
import utils from '@/tool/myUtils/utils'
import { IComment } from '@/type'
import { getCommentApi, getCommentHotRankApi, getCommentListApi } from '@/api/comment'
import { getProblemHotRankApi } from '@/api/problem'
import CommentCard from '@/components/Card/CommentCard'
import { Button, theme } from 'antd'

const Comment: React.FC = () => {
  const nav = myHooks.useNavTo()
  const pathname = useRecoilValue(pathNameState)
  const searchQuerys = useRecoilValue(searchQueryState)
  const [commentList, setCommentList] = useState<IComment[]>([])
  const [total, setTotal] = useState(0)
  const { token } = theme.useToken()

  const fetchFn = useMemo(() => {
    setCommentList([])
    return async (pageNum: number, pageSize: number, callback: Function) => {
      try {
        const list: IComment[] = []
        const data = (await getCommentHotRankApi(utils.getPathArray(pathname)[1], pageNum, pageSize)).data.data

        for (let comment of data.comments) {
          list.push((await getCommentApi(comment.Member)).data.data.comment)
        }
        setCommentList((value) => (value ? [...value, ...list] : list))
        setTotal(data.total)
        callback()
      } catch {}
    }
  }, [searchQuerys])

  const handleCardClick = (comment: IComment) => {
    // setcurrentArticle(comment)
    // nav(`/community/article/${comment.id}`)
  }

  return (
    <div className={style.comment}>
      <LoadMoreList
        dataSource={commentList}
        total={total}
        fetchFn={fetchFn}
        split={false}
        itemRender={(item: IComment) => (
          <CommentCard
            style={{
              backgroundColor: token.colorPrimaryBg,
              marginBottom: '2rem',
            }}
            commentProps={item}
            showReply={true}
          ></CommentCard>
        )}
      ></LoadMoreList>
    </div>
  )
}

export default Comment
