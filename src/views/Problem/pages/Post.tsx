import ArticleCard from '@/components/card/ArticleCard'
import React, { useMemo, useState } from 'react'
import { currentArticleState, pathNameState, searchQueryState } from '@/store/appStore'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import LoadMoreList from '@/components/List/LoadMoreList'
import myHooks from '@/tool/myHooks/myHooks'
import style from '../style.module.scss'
import utils from '@/tool/myUtils/utils'
import { IPost } from '@/type'
import { getPostApi, getPostHotRankApi, getPostListApi } from '@/api/post'
import { getProblemHotRankApi } from '@/api/problem'
import PostCard from '@/components/Card/PostCard'
import { Button, theme } from 'antd'

const Post: React.FC = () => {
  const nav = myHooks.useNavTo()
  const pathname = useRecoilValue(pathNameState)
  const searchQuerys = useRecoilValue(searchQueryState)
  const [postList, setPostList] = useState<IPost[]>([])
  const [total, setTotal] = useState(0)
  const { token } = theme.useToken()

  const fetchFn = useMemo(() => {
    setPostList([])
    return async (pageNum: number, pageSize: number, callback: Function) => {
      try {
        const list: IPost[] = []
        const data = (await getPostHotRankApi(utils.getPathArray(pathname)[1], pageNum, pageSize)).data.data

        for (let post of data.posts) {
          list.push((await getPostApi(post.Member)).data.data.post)
        }
        setPostList((value) => (value ? [...value, ...list] : list))
        setTotal(data.total)
        callback()
      } catch {}
    }
  }, [searchQuerys])

  const handleCardClick = (post: IPost) => {
    // setcurrentArticle(post)
    // nav(`/community/article/${post.id}`)
  }

  return (
    <div className={style.post}>
      <LoadMoreList
        dataSource={postList}
        total={total}
        fetchFn={fetchFn}
        split={false}
        itemRender={(item: IPost) => (
          <PostCard
            style={{
              backgroundColor: token.colorPrimaryBg,
              marginBottom: '2rem',
            }}
            postProps={item}
            showReply={true}
          ></PostCard>
        )}
      ></LoadMoreList>
    </div>
  )
}

export default Post
